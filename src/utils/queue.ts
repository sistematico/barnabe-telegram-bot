import { Context, InputFile } from 'grammy'
import { downloadVideo, validateUrl } from '@/utils'
import { unlinkSync } from 'node:fs'

interface QueueItem {
  ctx: Context
  userId: number
}

const userLastMessageTime: Record<number, number> = {};
const FLOOD_TIME_LIMIT = 5000; // Tempo em milissegundos, ex: 5 segundos

export async function processQueue(mq: QueueItem[], isProcessing: boolean) {
  if (isProcessing || mq.length === 0) return
  isProcessing = true

  const { ctx, userId } = mq.shift()!
  const currentTime = Date.now()

  // Verifica o controle de flood
  if (userLastMessageTime[userId] && (currentTime - userLastMessageTime[userId]) < FLOOD_TIME_LIMIT) {
    await ctx.reply('Por favor, aguarde um momento antes de enviar outra mensagem.');
  } else {
    userLastMessageTime[userId] = currentTime;
    // Processa a mensagem aqui (sua lógica de negócio)
    // Exemplo: await ctx.reply('Mensagem recebida.');
  }

  if (!ctx.msg) return
  const message = ctx.msg.text
  
  if (!message) return
  const url = validateUrl(message)

  if (url) {
    const file = await downloadVideo(url)
    if (file) {
      await ctx.replyWithVideo(new InputFile(file))
      unlinkSync(file)
    } else {
      await ctx.reply('Houve um erro.')
    }
  }

  isProcessing = false
  setTimeout(processQueue, 100) 
}