import type { Hyperdrive } from '@cloudflare/workers-types'
import Redis from 'ioredis'
import pg from 'pg'
import { Resend } from 'resend'
import Stripe from 'stripe'

const runtimeConfig = useRuntimeConfig()

const getDatabaseUrl = () => {
// @ts-expect-error globalThis.__env__ is not defined
  const hyperdrive = (process.env.HYPERDRIVE || globalThis.__env__?.HYPERDRIVE || globalThis.HYPERDRIVE) as Hyperdrive | undefined
  if (runtimeConfig.preset == 'node-server') {
    return runtimeConfig.databaseUrl
  } else {
    return hyperdrive?.connectionString || runtimeConfig.databaseUrl
  }
}

const newPgPool = () => new pg.Pool({
  connectionString: getDatabaseUrl(),
  max: 90,
  idleTimeoutMillis: 30000
})

const pgPool = newPgPool()

// PG Pool
export const getPgPool = () => {
  if (runtimeConfig.preset == 'node-server') {
    return pgPool
  } else {
    return newPgPool()
  }
}

// Cache Client
let redisClient: Redis | undefined
if (runtimeConfig.preset == 'node-server') {
  redisClient = new Redis(runtimeConfig.redisUrl)
}

export const cacheClient = {
  get: async (key: string) => {
    if (redisClient) {
      const value = await redisClient.get(key)
      return value
    } else {
      const value = await hubKV().get(key)
      if (!value) {
        return null
      }
      return JSON.stringify(value)
    }
  },
  set: async (key: string, value: string, ttl: number | undefined) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    if (redisClient) {
      if (ttl) {
        await redisClient.set(key, stringValue, 'EX', ttl)
      } else {
        await redisClient.set(key, stringValue)
      }
    } else {
      if (ttl) {
        await hubKV().set(key, stringValue, { ttl })
      } else {
        await hubKV().set(key, stringValue)
      }
    }
  },
  delete: async (key: string) => {
    if (redisClient) {
      await redisClient.del(key)
    } else {
      await hubKV().del(key)
    }
  }
}

export const resendInstance = new Resend(runtimeConfig.resendApiKey)

export const stripeClient = new Stripe(runtimeConfig.stripeSecretKey!)
