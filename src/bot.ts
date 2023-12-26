import { Hono } from "hono";
import { Bot, Context, webhookCallback, InputFile } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import YTDlpWrap from "yt-dlp-wrap";
import { unlink, exists } from 'fs/promises';
import { errorHandler } from "@/mw/error"

type MyContext = Context & {
  ip: string | null;
};

const app = new Hono();
app.use(errorHandler);

const token = Bun.env.BOT_TOKEN
if (!token) throw new Error("Token not set");

const bot = new Bot<MyContext>(token);
const ytdlp = new YTDlpWrap("/usr/local/bin/yt-dlp");

bot.api.config.use(autoRetry({ maxRetryAttempts: 1, maxDelaySeconds: 5 }));

app.use('/', async (ctx, next) => {
  const clientIP = ctx.req.header('x-forwarded-for') || ctx.req.header('x-real-ip') || null;
  
  // ctx.set('clientIP', clientIP); // Armazena o IP no contexto


  bot.use(async (ctx, next) => {
    ctx.ip = clientIP;
    await next();
  });

  await next();
});


async function downloadVideo(url: string, clientIP: string | null) {
  const videoInfo = await ytdlp.getVideoInfo(url);
  
  const title = videoInfo.title;
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_'); // Remove caracteres especiais
  
  const downloadPath = `${safeTitle}.mp4`;
  
  if (clientIP) {
    await ytdlp.exec([url, '--source-address', clientIP, '-c', '--no-part', '-f', 'b', '-o', downloadPath]);
  } else {
    await ytdlp.exec([url, '-c', '--no-part', '-f', 'b', '-o', downloadPath]);
  }
  // const download = await ytdlp.exec([url, '--source-address', '-c', '--no-part', '-f', 'b', '-o', downloadPath]);

  return downloadPath;
}

bot.chatType("private").on("message:entities:url", async (ctx) => {
  const urlMatch = ctx.message?.text.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) return;

  const url = urlMatch[0];

  try {
    // const downloadPath = await downloadVideo(url);
    const clientIP = ctx.ip; // Pega o IP do cliente do contexto
    const downloadPath = await downloadVideo(url, clientIP);

    if (!await exists(downloadPath)) return;

    const video = new InputFile(downloadPath);
    await ctx.replyWithVideo(video);

    await unlink(downloadPath);

    return;
  } catch (error) {
    console.error(error);
    ctx.reply("Houve um erro ao baixar o vídeo:\n\n" + JSON.stringify(error, null, 2));
  }
});

if (Bun.env.NODE_ENV === "production") {
  const webhookUrl = Bun.env.BOT_WEBHOOK_URL
  if (!webhookUrl) throw new Error('BOT_WEBHOOK_URL is required for production mode');

  bot.api.setWebhook(webhookUrl);
  app.use(webhookCallback(bot, "hono"));
} else {
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Erro ao processar update ${ctx.update.update_id}:`, err.error);
  });
  
  bot.start();
}

export default { port: 3008, fetch: app.fetch };