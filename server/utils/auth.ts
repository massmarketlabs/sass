import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, anonymous } from 'better-auth/plugins'
import * as schema from '../database/schema'
import { db } from './db'
import { processEnv, redisInstance, resendInstance } from './drivers'

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
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const response = await resendInstance.emails.send({
        from: `${processEnv.APP_NAME} <${processEnv.APP_FROM_EMAIL}>`,
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`
      })
      if (response.error) {
        console.log(response.error)
      }
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const response = await resendInstance.emails.send({
        from: `${processEnv.APP_NAME} <${processEnv.APP_FROM_EMAIL}>`,
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`
      })
      if (response.error) {
        console.log(response.error)
      }
    }
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
