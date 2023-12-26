import { Hono } from 'hono'
import { webhookCallback, InputFile } from 'grammy'
import { bot, validateUrl, downloadVideo, sendLogToChannel } from '@/utils'
import { floodControlPlugin } from '@/mw/flood'
import { unlinkSync } from 'node:fs'

const app = new Hono()
const port = Bun.env.BOT_PORT || 3008

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