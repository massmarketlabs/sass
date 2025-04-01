import type { ShallowRef } from 'vue'
import type { UTableInstance } from '../types'

export default function useColumnControl<T>(columns: AdminTableColumn<T>[], tableRef: ShallowRef<UTableInstance | null>) {
  const defaultSelectedColumns = columns
    .map(column => column.accessorKey)
  const selectedColumns = ref(defaultSelectedColumns)

  watchEffect(() => {
    for (const column of columns) {
      if (selectedColumns.value.includes(column.accessorKey)) {
        tableRef.value?.tableApi?.getColumn(column.accessorKey)?.toggleVisibility(true)
      }
      else {
        tableRef.value?.tableApi?.getColumn(column.accessorKey)?.toggleVisibility(false)
      }
    }
  })
  return {
    selectedColumns
  }
}
