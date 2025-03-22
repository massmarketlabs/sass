export type { FormSubmitEvent, NavigationMenuItem, TableColumn, TableData } from '@nuxt/ui'

export type { UserWithRole } from 'better-auth/plugins'

export { z } from 'zod'
export type { output as zodOutput } from 'zod'

export type TranFunction = (name: string, options?: StringDict<any>) => string
export interface SortBy {
  column: string
  direction: 'asc' | 'desc' | undefined
}
export interface StringDict<T> {
  [key: string]: T
}
