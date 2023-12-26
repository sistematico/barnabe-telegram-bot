import { Context, MiddlewareFn, NextFunction } from 'grammy';

// Definição da interface para cada item na fila
interface QueueItem {
  ctx: Context;
  userId: number;
}

// Configurações do plugin
const FLOOD_TIME_LIMIT = 5000; // Tempo em milissegundos para o controle de flood

// Criação do plugin de controle de flood
export function floodControlPlugin(): MiddlewareFn {
  const messageQueue: QueueItem[] = [];
  let isProcessing = false;
  const userLastMessageTime: Record<number, number> = {};

  // Função para processar a fila
  const processQueue = async (next: NextFunction) => {
    if (isProcessing || messageQueue.length === 0) return;
    isProcessing = true;

    const { ctx, userId } = messageQueue.shift()!;
    const currentTime = Date.now();

    if (userLastMessageTime[userId] && (currentTime - userLastMessageTime[userId]) < FLOOD_TIME_LIMIT) {
      await ctx.reply('Por favor, aguarde um momento antes de enviar outra mensagem.');
    } else {
      userLastMessageTime[userId] = currentTime;
      await next(); // Processa a mensagem
    }

    isProcessing = false;
    setTimeout(() => processQueue(next), 100);
  };

  // Middleware do plugin
  return async (ctx, next) => {
    if (ctx.from) {
      const userId = ctx.from.id
      messageQueue.push({ ctx, userId })
    }
    await processQueue(next)
  };
}