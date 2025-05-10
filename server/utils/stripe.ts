// import { stripe } from '@better-auth/stripe'
// import Stripe from 'stripe'
// import { runtimeConfig } from './runtimeConfig'

// export const setupStripe = () => stripe({
//   stripeClient: new Stripe(runtimeConfig.stripeSecretKey!),
//   stripeWebhookSecret: runtimeConfig.stripeWebhookSecret,
//   createCustomerOnSignUp: true,
//   subscription: {
//     enabled: true,
//     plans: [
//       {
//         name: 'pro-monthly',
//         priceId: runtimeConfig.stripePriceIdProMonth,
//         freeTrial: {
//           days: 14,
//           onTrialStart: async (subscription) => {
//             // Called when a trial starts
//             console.log(`pro onTrialStart: ${subscription.referenceId}`)
//           },
//           onTrialEnd: async ({ subscription }) => {
//             // Called when a trial ends
//             console.log(`pro onTrialEnd: ${subscription.referenceId}`)
//           },
//           onTrialExpired: async (subscription) => {
//             // Called when a trial expires without conversion
//             console.log(`pro onTrialExpired: ${subscription.referenceId}`)
//           }
//         }
//       },
//       {
//         name: 'pro-yearly',
//         priceId: runtimeConfig.stripePriceIdProYear,
//         freeTrial: {
//           days: 14,
//           onTrialStart: async (subscription) => {
//             // Called when a trial starts
//             console.log(`pro onTrialStart: ${subscription.referenceId}`)
//           },
//           onTrialEnd: async ({ subscription }) => {
//             // Called when a trial ends
//             console.log(`pro onTrialEnd: ${subscription.referenceId}`)
//           },
//           onTrialExpired: async (subscription) => {
//             // Called when a trial expires without conversion
//             console.log(`pro onTrialExpired: ${subscription.referenceId}`)
//           }
//         }
//       }
//     ]
//   },
//   onSubscriptionComplete: async (data: any) => {
//     // Called when a subscription is successfully created
//     console.log(`onSubscriptionComplete: ${data}`)
//   },
//   onSubscriptionUpdate: async (data: any) => {
//     // Called when a subscription is updated
//     console.log(`onSubscriptionUpdate: ${data}`)
//   },
//   onSubscriptionCancel: async (data: any) => {
//     // Called when a subscription is canceled
//     console.log(`onSubscriptionCancel: ${data}`)
//   },
//   onSubscriptionDeleted: async (data: any) => {
//     // Called when a subscription is deleted
//     console.log(`onSubscriptionDeleted: ${data}`)
//   }
// })
