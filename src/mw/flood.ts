import { MiddlewareFn, Context } from 'grammy'

interface QueueItem {
  ctx: Context
  next: () => Promise<void>
}

export function floodControlPlugin(): MiddlewareFn {
  const messageQueue: QueueItem[] = []
  let isProcessing = false
  const userLastMessageTime: Record<number, number> = {}
  const FLOOD_TIME_LIMIT = 5000 // 5 segundos

  async function processQueue() {
    if (isProcessing || messageQueue.length === 0) return
    isProcessing = true

    const queueItem = messageQueue.shift()!
    const { ctx, next } = queueItem

    if (ctx.from) {
      const userId = ctx.from.id
      const currentTime = Date.now()

      if (userLastMessageTime[userId] && currentTime - userLastMessageTime[userId] < FLOOD_TIME_LIMIT) {
        await ctx.reply('Por favor, aguarde um momento antes de enviar outra mensagem.')
      } else {
        userLastMessageTime[userId] = currentTime
        await next() // Chama next apenas uma vez por contexto
      }
    } else {
      // Se 'from' não está definido, simplesmente passa para o próximo middleware
      await next()
    }

    isProcessing = false
    process.nextTick(processQueue)
  }

  return async (ctx, next) => {
    messageQueue.push({ ctx, next })
    processQueue()
  }
}
