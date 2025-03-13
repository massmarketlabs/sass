import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, anonymous } from 'better-auth/plugins'
import * as schema from '../database/schema'
import { db } from './db'
import { processEnv, redisInstance } from './drivers'

export const auth = betterAuth({
  baseURL: processEnv.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true
  }),
  secondaryStorage: {
    get: async (key) => {
      const value = await redisInstance.get(key)
      return value || null
    },
    set: async (key, value, ttl) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      if (ttl) {
        await redisInstance.set(key, stringValue, 'EX', ttl)
      } else {
        await redisInstance.set(key, stringValue)
      }
    },
    delete: async (key) => {
      await redisInstance.del(key)
    }
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: processEnv.GITHUB_CLIENT_ID!,
      clientSecret: processEnv.GITHUB_CLIENT_SECRET!
    }
  },
  account: {
    accountLinking: {
      enabled: true
    }
  },
  plugins: [anonymous(), admin()]
})
