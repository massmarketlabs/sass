import type { ShallowRef } from 'vue'
import type { UTableInstance } from '../types'

export default function useSortControl<T>(columns: AdminTableColumn<T>[], tableRef: ShallowRef<UTableInstance | null>) {
  console.log(columns, tableRef)
  const sortOptions = ref([])
  return {
    sortOptions
  }
}
