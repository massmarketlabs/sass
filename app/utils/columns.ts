import type { Row } from '@tanstack/vue-table'
import { UAvatar, UBadge, UButton, UDropdownMenu, UTooltip } from '#components'

export const getColumnValue = (cell: any) => {
  const row = cell.row as Row<any>
  const value = row.getValue<string>(cell.column.id)
  return value
}
export const htmlColumn = (cell: any, el = 'span') => {
  const value = getColumnValue(cell)
  return h(el, { innerHTML: value }, [])
}

export const IDColumn = (cell: any) => {
  const value = getColumnValue(cell)
  return h(UTooltip, {
    text: value
  }, () => h(
    'span',
    {},
    value.substring(0, 8)
  ))
}

export const timeColumn = (cell: any) => {
  const value = getColumnValue(cell)
  return formatToDatetime(value)
}

export const yesNoColumn = (cell: any, t: TranFunction) => {
  const value = getColumnValue(cell)
  const color = value ? 'success' : 'error'
  return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => value ? t('yes') : t('no'))
}

export const avatarColumn = (cell: any) => {
  const value = getColumnValue(cell)
  if (value) {
    return h(UAvatar, { src: value })
  }
}

export const isEnabledColumn = (cell: any, t: TranFunction) => {
  const value = getColumnValue(cell)
  const color = value ? 'success' : 'error'
  return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => value ? t('enable') : t('disable'))
}

export const actionColumn = (row: Row<any>, getRowItems: (row: Row<any>) => any[]) => {
  return h(
    'div',
    { class: 'text-right' },
    h(
      UDropdownMenu as any,
      {
        content: {
          align: 'end'
        },
        items: getRowItems(row)
      },
      () => h(UButton, {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost',
        class: 'ml-auto'
      })
    )
  )
}
