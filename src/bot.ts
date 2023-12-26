import { Hono } from 'hono'
import { Context, InputFile, MiddlewareFn, webhookCallback } from 'grammy'
import { bot, validateUrl, downloadVideo, sendLogToChannel } from '@/utils'
import { unlinkSync } from 'node:fs'
// import { floodControlPlugin } from '@/mw/flood'

const app = new Hono()
const port = Bun.env.BOT_PORT || 3008

interface QueueItem {
  ctx: Context
  next: () => Promise<void>
}

function floodControlPlugin(): MiddlewareFn {
  const messageQueue: QueueItem[] = []
  let isProcessing = false
  const userLastMessageTime: Record<number, number> = {}
  const FLOOD_TIME_LIMIT = 5000

  async function processQueue() {
    if (isProcessing || messageQueue.length === 0) return
    isProcessing = true

    const queueItem = messageQueue.shift()!
    const { ctx, next } = queueItem
    
    if (ctx.from) {
      const userId = ctx.from.id
      const currentTime = Date.now()

      if (userLastMessageTime[userId] && (currentTime - userLastMessageTime[userId]) < FLOOD_TIME_LIMIT) {
        await ctx.reply('Por favor, aguarde um momento antes de enviar outra mensagem.')
      } else {
        userLastMessageTime[userId] = currentTime;
        await next()
      }
    } else {
      await next() // Chama next se 'from' não está definido
    }

    isProcessing = false
    if (messageQueue.length > 0) await processQueue() // Chama processQueue novamente se há mais itens na fila
  }

  return async (ctx, next) => {
    messageQueue.push({ ctx, next })
    if (!isProcessing) await processQueue()
  }
}

bot.use(floodControlPlugin)

bot.on('message:entities:url', async ctx => {
  const message = ctx.message.text
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
})

if (Bun.env.NODE_ENV === 'production') {
  const webhookUrl = Bun.env.WEBHOOK_URL
  if (!webhookUrl) throw new Error('WEBHOOK_URL is required for production mode')

  bot.api.setWebhook(webhookUrl)
  app.post('/', webhookCallback(bot, 'hono'))

  sendLogToChannel('🚀 Bot reiniciado em modo de produção: ' + new Date())
} else {
  sendLogToChannel('🚀 Bot reiniciado em modo de desenvolvimento: ' + new Date())
  bot.start()
}

export default { port, fetch: app.fetch }