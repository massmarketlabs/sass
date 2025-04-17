import { stripe } from '@better-auth/stripe'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import * as schema from '../database/schema'
import { db } from './db'
import { processEnv, redisInstance, resendInstance, stripeClient } from './drivers'

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
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
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
  plugins: [
    admin(),
    stripe({
      stripeClient,
      stripeWebhookSecret: processEnv.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'pro-month',
            priceId: processEnv.STRIPE_PRICE_ID_PRO_MONTH,
            limits: {
              projects: 1,
              storage: 100
            },
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
            name: 'pro-year',
            priceId: processEnv.STRIPE_PRICE_ID_PRO_YEAR,
            limits: {
              projects: 1,
              storage: 100
            },
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
