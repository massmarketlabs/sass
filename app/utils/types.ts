import type { FormSubmitEvent } from '@nuxt/ui'
import type {
  ClientOptions,
  InferUserFromClient
} from 'better-auth/client'
import type { UserWithRole } from 'better-auth/plugins'

export type { FormSubmitEvent }

export type ExtendedUser = InferUserFromClient<ClientOptions> & UserWithRole
