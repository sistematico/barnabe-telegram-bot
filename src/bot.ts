import { Hono } from "hono";
import { Bot, webhookCallback, InputFile } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import YTDlpWrap from "yt-dlp-wrap";
import { unlink, exists } from 'fs/promises';
import { errorHandler } from "@/mw/error"

const app = new Hono();
app.use(errorHandler);

const token = Bun.env.BOT_TOKEN
if (!token) throw new Error("Token not set");

const bot = new Bot(token);
const ytdlp = new YTDlpWrap("/usr/local/bin/yt-dlp");

bot.api.config.use(autoRetry({ maxRetryAttempts: 1, maxDelaySeconds: 5 }));

async function downloadVideo(url: string) {
  const videoInfo = await ytdlp.getVideoInfo(url);
  
  const title = videoInfo.title;
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_'); // Remove caracteres especiais
  
  const downloadPath = `${safeTitle}.mp4`;
  await ytdlp.exec([url, '-f', 'best[ext=mp4]', '-o', downloadPath]);
  
  return downloadPath;
}

bot.chatType("private").on("message:entities:url", async (ctx) => {
  const urlMatch = ctx.message?.text.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) return;

  const url = urlMatch[0];

  try {
    const downloadPath = await downloadVideo(url);

    if (!await exists(downloadPath)) return;

    const video = new InputFile(downloadPath);
    await ctx.replyWithVideo(video);

    await unlink(downloadPath);
  } catch (error) {
    console.error(error);
    ctx.reply("Houve um erro ao baixar o vídeo.");
  }
});

if (Bun.env.NODE_ENV === "production") {
  app.use(webhookCallback(bot, "hono"));
} else {
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Erro ao processar update ${ctx.update.update_id}:`, err.error);
  });
  
  bot.start();
}

export default { port: 3008, fetch: app.fetch };