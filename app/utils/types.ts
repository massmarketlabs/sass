import type { CalendarDate } from '@internationalized/date'
import type { TableColumn } from '@nuxt/ui'
import type { CellContext, RowData } from '@tanstack/vue-table'

export type { FormSubmitEvent, NavigationMenuItem, TableData } from '@nuxt/ui'
export { default as UAvatar } from '@nuxt/ui/runtime/components/Avatar.vue'
export { default as UBadge } from '@nuxt/ui/runtime/components/Badge.vue'
export { default as UButton } from '@nuxt/ui/runtime/components/Button.vue'
export { default as UDropdownMenu } from '@nuxt/ui/runtime/components/DropdownMenu.vue'
export { default as UTable } from '@nuxt/ui/runtime/components/Table.vue'
export { default as UTooltip } from '@nuxt/ui/runtime/components/Tooltip.vue'

export type { Row } from '@tanstack/vue-table'

export type { UserWithRole } from 'better-auth/plugins'

export { z } from 'zod'
export type { output as zodOutput } from 'zod'

export type TranFunction = (name: string, options?: StringDict<any>) => string
export type ColumnCell<TData extends RowData, TValue = unknown> = CellContext<TData, TValue>
export type AdminTableColumn<T extends TableData, D = unknown> = TableColumn<T, D> & {
  accessorKey?: string
  header?: string
  id?: string
}

export interface StringDict<T> {
  [key: string]: T
}

export interface FilterItem {
  label: string
  id: string
  count?: number
}

export interface DateRange { start: CalendarDate | undefined, end: CalendarDate | undefined }

export type AdminTableFilter =
  | {
    name: string
    field: string
    value: string | undefined
    type: 'input'
  }
  | {
    name: string
    field: string
    value: string[]
    type: 'checkbox'
    items: FilterItem[]
  }
  | {
    name: string
    field: string
    value: DateRange
    type: 'daterange'
  }

export interface SortOption {
  field: string
  order: string
}

export type FilterCondition = {
  col: string
  op: 'between'
  v: [string, string]
} | {
  col: string
  op: 'in'
  v: string[]
} | {
  col: string
  op: 'like'
  v: string
}

export interface FetchDataParams {
  page: number
  limit: number
  sort: SortOption[]
  filter: FilterCondition[]
}

export interface PaginationResult<T> {
  data: T[]
  total: number
}

export type FetchDataFn<T> = (params: FetchDataParams) => Promise<PaginationResult<T>>
