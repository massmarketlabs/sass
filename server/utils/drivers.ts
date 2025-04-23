import Redis from 'ioredis'
import pg from 'pg'
import { Resend } from 'resend'
import Stripe from 'stripe'

export const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 90,
  idleTimeoutMillis: 30000
})

export const redisInstance = new Redis(process.env.REDIS_URL as string)

export const resendInstance = new Resend(process.env.RESEND_API_KEY)

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)
