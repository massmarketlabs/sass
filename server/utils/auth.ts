import { stripe } from '@better-auth/stripe'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI } from 'better-auth/plugins'
import Redis from 'ioredis'
import { v7 as uuidv7 } from 'uuid'
import * as schema from '../database/schema'
import { db } from './db'
import { kvClient, resendInstance, stripeClient } from './drivers'

const runtimeConfig = useRuntimeConfig()
console.log(`Base URL is ${runtimeConfig.public.baseURL}`)

export const auth = betterAuth({
  baseURL: runtimeConfig.public.baseURL,
  secret: runtimeConfig.betterAuthSecret,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  advanced: {
    database: {
      generateId: () => {
        return uuidv7()
      }
    }
  },
  secondaryStorage: {
    get: async (key) => {
      if (!kvClient) {
        return null
      }
      if (kvClient instanceof Redis) {
        const value = await kvClient.get(key)
        return value
      } else {
        const value = await kvClient.get(key)
        if (!value) {
          return null
        }
        return JSON.stringify(value)
      }
    },
    set: async (key, value, ttl) => {
      if (!kvClient) {
        return null
      }
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      if (kvClient instanceof Redis) {
        if (ttl) {
          await kvClient.set(key, stringValue, 'EX', ttl)
        } else {
          await kvClient.set(key, stringValue)
        }
      } else {
        if (ttl) {
          await kvClient.set(key, stringValue, { ttl })
        } else {
          await kvClient.set(key, stringValue)
        }
      }
    },
    delete: async (key) => {
      if (!kvClient) {
        return null
      }
      if (kvClient instanceof Redis) {
        await kvClient.del(key)
      } else {
        await kvClient.del(key)
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
