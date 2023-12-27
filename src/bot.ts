import { Bot, InputFile } from "grammy";
import { run } from "@grammyjs/runner";
import YTDlpWrap from "yt-dlp-wrap";
import { unlink } from 'fs/promises';

const token = Bun.env.BOT_TOKEN
if (!token) throw new Error("Token not set");

const apiRoot = Bun.env.BOT_API_ROOT || 'http://127.0.0.1:8081'

const bot = new Bot(token as string, { client: { apiRoot } });  
const ytdlp = new YTDlpWrap("/usr/local/bin/yt-dlp");

// bot.api.config.use(autoRetry({ maxRetryAttempts: 1, maxDelaySeconds: 5 }));

async function downloadVideo(url: string) {
  const videoInfo = await ytdlp.getVideoInfo(url);
  
  const title = videoInfo.title;
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_'); // Remove caracteres especiais
  
  const downloadPath = `${safeTitle}.mp4`;  
  await ytdlp.exec([url, '-c', '-w', '--no-part', '-f', 'b', '-o', downloadPath]);

  return downloadPath;
}

bot.chatType("private").on("message:entities:url", async (ctx) => {
  const urlMatch = ctx.message?.text.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) return;

  const url = urlMatch[0];

  try {
    const downloadPath = await downloadVideo(url);
    const file = Bun.file(downloadPath);

    if (!await file.exists()) {
      ctx.reply("Houve um erro ao baixar o vídeo(código: 0975)");
      return;
    }

    const video = new InputFile(downloadPath);
    await ctx.replyWithVideo(video);

    await unlink(downloadPath);

    return;
  } catch (error) {
    console.error(error);
    ctx.reply("Houve um erro ao baixar o vídeo:\n\n" + JSON.stringify(error, null, 2));
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Erro ao processar update ${ctx.update.update_id}:`, err.error);
});
  
run(bot);