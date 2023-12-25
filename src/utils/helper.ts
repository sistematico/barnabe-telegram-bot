import { bot } from '@/utils'

const logChannel = Bun.env.BOT_LOG_CHANNEL || '-1002084616486'

export async function sendLogToChannel(message: string) {
  try {
    await bot.api.sendMessage(logChannel, message)
  } catch (error) {
    console.error('Erro ao enviar log para o canal:', error)
  }
}