import { Context, MiddlewareFn, NextFunction } from 'grammy'


interface QueueItem {
  ctx: Context
  userId: number
}

const FLOOD_TIME_LIMIT = Number(Bun.env.FLOOD_TIME_LIMIT) || 5000

// Criação do plugin de controle de flood
export function floodControlPlugin(): MiddlewareFn {
  let isProcessing = false
  
  const messageQueue: QueueItem[] = []
  const userLastMessageTime: Record<number, number> = {}

  const processQueue = async (next: NextFunction) => {
    if (isProcessing || messageQueue.length === 0) return
    isProcessing = true

    const { ctx, userId } = messageQueue.shift()!
    const currentTime = Date.now()

    if (userLastMessageTime[userId] && (currentTime - userLastMessageTime[userId]) < FLOOD_TIME_LIMIT) {
      await ctx.reply('Por favor, aguarde um momento antes de enviar outra mensagem.')
    } else {
      userLastMessageTime[userId] = currentTime;
      await next()
    }

    isProcessing = false
    setTimeout(() => processQueue(next), 500)
  }

  return async (ctx, next) => {
    if (ctx.from) {
      const userId = ctx.from.id
      messageQueue.push({ ctx, userId })
    }

    await processQueue(next)
  }
}