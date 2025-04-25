import type { H3Event } from 'h3'
import { stripe } from '@better-auth/stripe'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI } from 'better-auth/plugins'
import { v7 as uuidv7 } from 'uuid'
import * as schema from '../database/schema'
import { db, newDB } from './db'
import { redisClient, resendInstance, stripeClient } from './drivers'

const runtimeConfig = useRuntimeConfig()
console.log(`Base URL is ${runtimeConfig.public.baseURL}`)

const newAuth = () => betterAuth({
  baseURL: runtimeConfig.public.baseURL,
  secret: runtimeConfig.betterAuthSecret,
  database: drizzleAdapter(
    runtimeConfig.preset == 'node-server' ? db : newDB(),
    {
      provider: 'pg',
      schema
    }
  ),
  advanced: {
    database: {
      generateId: () => {
        return uuidv7()
      }
    }
  },
  secondaryStorage: {
    get: async (key) => {
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
    set: async (key, value, ttl) => {
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
    delete: async (key) => {
      if (redisClient) {
        await redisClient.del(key)
      } else {
        await hubKV().del(key)
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const response = await resendInstance.emails.send({
        from: `${runtimeConfig.public.appName} <${runtimeConfig.public.appNotifyEmail}>`,
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
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const response = await resendInstance.emails.send({
        from: `${runtimeConfig.public.appName} <${runtimeConfig.public.appNotifyEmail}>`,
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
      clientId: runtimeConfig.githubClientId!,
      clientSecret: runtimeConfig.githubClientSecret!
    },
    google: {
      clientId: runtimeConfig.googleClientId!,
      clientSecret: runtimeConfig.googleClientSecret!
    }
  },
  account: {
    accountLinking: {
      enabled: true
    }
  },
  plugins: [
    ...(runtimeConfig.public.appEnv === 'development' ? [openAPI()] : []),
    admin(),
    stripe({
      stripeClient,
      stripeWebhookSecret: runtimeConfig.stripeWebhookSecret,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'pro-monthly',
            priceId: runtimeConfig.stripePriceIdProMonth,
            freeTrial: {
              days: 14,
              onTrialStart: async (subscription) => {
                // Called when a trial starts
                console.log(`pro onTrialStart: ${subscription.referenceId}`)
              },
              onTrialEnd: async ({ subscription }) => {
                // Called when a trial ends
                console.log(`pro onTrialEnd: ${subscription.referenceId}`)
              },
              onTrialExpired: async (subscription) => {
                // Called when a trial expires without conversion
                console.log(`pro onTrialExpired: ${subscription.referenceId}`)
              }
            }
          },
          {
            name: 'pro-yearly',
            priceId: runtimeConfig.stripePriceIdProYear,
            freeTrial: {
              days: 14,
              onTrialStart: async (subscription) => {
                // Called when a trial starts
                console.log(`pro onTrialStart: ${subscription.referenceId}`)
              },
              onTrialEnd: async ({ subscription }) => {
                // Called when a trial ends
                console.log(`pro onTrialEnd: ${subscription.referenceId}`)
              },
              onTrialExpired: async (subscription) => {
                // Called when a trial expires without conversion
                console.log(`pro onTrialExpired: ${subscription.referenceId}`)
              }
            }
          }
        ]
      },
      onSubscriptionComplete: async (data: any) => {
        // Called when a subscription is successfully created
        console.log(`onSubscriptionComplete: ${data}`)
      },
      onSubscriptionUpdate: async (data: any) => {
        // Called when a subscription is updated
        console.log(`onSubscriptionUpdate: ${data}`)
      },
      onSubscriptionCancel: async (data: any) => {
        // Called when a subscription is canceled
        console.log(`onSubscriptionCancel: ${data}`)
      },
      onSubscriptionDeleted: async (data: any) => {
        // Called when a subscription is deleted
        console.log(`onSubscriptionDeleted: ${data}`)
      }
    })
  ]
})

const auth = newAuth()

export const useServerAuth = () => {
  if (runtimeConfig.preset == 'node-server') {
    return auth
  } else {
    return newAuth()
  }
}

export const getAuthSession = async (event: H3Event) => {
  const headers = event.headers
  const serverAuth = useServerAuth()
  const session = await serverAuth.api.getSession({
    headers
  })
  return session
}

export const requireAuth = async (event: H3Event) => {
  const session = await getAuthSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  // Save the session to the event context for later use
  event.context.auth = session!
  return session!
}
