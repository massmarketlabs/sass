import type {
  ClientOptions,
  InferUserFromClient
} from 'better-auth/client'
import type { UserWithRole } from 'better-auth/plugins'

export type { FormSubmitEvent, NavigationMenuItem, TableData } from '@nuxt/ui'

export type ExtendedUser = InferUserFromClient<ClientOptions> & UserWithRole
export interface StringDict<T> {
  [key: string]: T
}
