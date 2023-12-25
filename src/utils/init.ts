import { Bot, Context } from 'grammy'
import { autoRetry } from '@grammyjs/auto-retry'
import { apiThrottler } from '@grammyjs/transformer-throttler'

const token = Bun.env.BOT_TOKEN
if (!token) throw Error('Token não definido')
const bot = new Bot<Context>(token)

bot.api.config.use(apiThrottler({
  global: {
    maxConcurrent: 30,
    minTime: 33,
    reservoir: 30,
    reservoirRefreshAmount: 30,
    reservoirRefreshInterval: 1000,
  },
  out: {
    maxConcurrent: 30,
    minTime: 33,
  }
}))

bot.api.config.use(autoRetry({
  maxRetryAttempts: 10,   // only repeat requests once
  maxDelaySeconds: 5,     // fail immediately if we have to wait >5 seconds
}))

export { bot }