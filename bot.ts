import { Hono } from 'hono'
import { Bot, webhookCallback } from 'grammy'

const { BOT_TOKEN, BOT_PORT } = Bun.env

const app = new Hono()
const token = BOT_TOKEN || ''
const port = BOT_PORT || 3003

if (!token || token == '') throw new Error('Token não definido')
const bot = new Bot(token)

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."))
bot.on("message", (ctx) => ctx.reply("Got another message!"))

app.get('/', c => c.text('Barnabé Telegram Bot'))
app.post('/', webhookCallback(bot, 'hono'))

export default { port, fetch: app.fetch }