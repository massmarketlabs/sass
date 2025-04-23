import Redis from 'ioredis'
import pg from 'pg'
import { Resend } from 'resend'
import Stripe from 'stripe'

const runtimeConfig = useRuntimeConfig()

export const pgPool = new pg.Pool({
  connectionString: runtimeConfig.databaseUrl,
  max: 90,
  idleTimeoutMillis: 30000
})

export const redisInstance = new Redis(runtimeConfig.redisUrl)

export const resendInstance = new Resend(runtimeConfig.resendApiKey)

export const stripeClient = new Stripe(runtimeConfig.stripeSecretKey!)
