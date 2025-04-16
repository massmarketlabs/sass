import { config } from 'dotenv'
import Redis from 'ioredis'
import pg from 'pg'
import { Resend } from 'resend'
import Stripe from 'stripe'

config()

export const processEnv = process.env

export const pgPool = new pg.Pool({
  connectionString: processEnv.DATABASE_URL,
  max: 90,
  idleTimeoutMillis: 30000
})

export const redisInstance = new Redis(processEnv.REDIS_URL as string)

export const resendInstance = new Resend(processEnv.RESEND_API_KEY)

export const stripeClient = new Stripe(processEnv.STRIPE_SECRET_KEY!)
