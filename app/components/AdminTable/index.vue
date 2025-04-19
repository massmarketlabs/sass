<script setup lang="ts" generic="T">
import type { UTableInstance } from './types'
import { useDebounceFn } from '@vueuse/core'
import { FetchError } from 'ofetch'
import { useRoute, useRouter } from 'vue-router'
import ColumnControl from './components/ColumnControl.vue'
import Pagination from './components/Pagination/index.vue'
import SortControl from './components/SortControl/index.vue'
import useColumnControl from './composables/useColumnControl'
import useSelectControl from './composables/useSelectControl'

const { fetchData, columns, hidePagination = false, canSelect = false, rowId } = defineProps<{
  fetchData: FetchDataFn<T>
  columns: AdminTableColumn<T>[]
  hidePagination?: boolean
  canSelect?: boolean
  rowId?: string
}>()

const route = useRoute()
const router = useRouter()
const toast = useToast()

const page = ref<number>(Number(route.query.page) || 1)
const limit = ref<number>(Number(route.query.limit) || 20)
const loading = ref(false)
const total = ref(0)
const data = ref<any[]>([])
const rowSelection = defineModel<Record<string, boolean>>('rowSelection', { default: {} })

const sortOptions = ref<SortOption[]>([])

const tableRef = useTemplateRef<UTableInstance>('table')
const { selectedColumns } = useColumnControl(columns, tableRef)
const { selectColumnId, getRowId, selectedRowCount, rowCount } = useSelectControl(tableRef, rowId)

const fetchTableData = useDebounceFn(async () => {
  loading.value = true
  try {
    const result = await fetchData({
      page: page.value,
      limit: limit.value,
      sort: sortOptions.value
    })
    data.value = result.data || []
    total.value = result.total || 0
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      toast.add({
        description: error.data?.message || error.message,
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
    console.error('Error fetching data:', error)
    loading.value = false
  } finally {
    loading.value = false
  }
})

// Watch sortOptions and sync to URL
watch(
  () => sortOptions.value,
  (newSortOptions) => {
    const query = { ...route.query }
    if (newSortOptions.length) {
      query.sort = JSON.stringify(newSortOptions)
    } else {
      delete query.sort
    }
    router.replace({ query })
    fetchTableData()
  },
  { immediate: true, deep: true }
)

// Watch page and limit and sync to URL
watch(
  [page, limit],
  ([newPage, newLimit]) => {
    const query = { ...route.query, page: newPage, limit: newLimit }
    router.replace({ query })
    fetchTableData()
  }
)

const updatePage = (value: number) => {
  page.value = value
}

const updateLimit = (value: number) => {
  limit.value = value
}

const refreshSuccess = ref(false)

const handleRefresh = async () => {
  refreshSuccess.value = false
  await fetchTableData()
  refreshSuccess.value = true
  setTimeout(() => {
    refreshSuccess.value = false
  }, 1000)
}

onMounted(() => {
  if (route.query.sort) {
    try {
      sortOptions.value = JSON.parse(route.query.sort as string)
    } catch {
      sortOptions.value = []
    }
  }
  fetchTableData()
})

defineExpose({
  fetchTableData
})
</script>

<template>
  <div>
    <FlexThreeColumn>
      <template #left>
        <slot name="top-Left" />
      </template>
      <template #right>
        <slot name="top-right" />
        <UButton
          :color="refreshSuccess ? 'success' : 'neutral'"
          variant="outline"
          :icon="loading ? 'i-lucide-loader-2' : (refreshSuccess ? 'i-lucide-check' : 'i-lucide-refresh-cw')"
          :loading="loading"
          @click="handleRefresh"
        />
        <SortControl
          v-model:sort-options="sortOptions"
          :columns="columns"
        />
        <ColumnControl
          v-model:selected-columns="selectedColumns"
          :columns="columns"
        />
      </template>
    </FlexThreeColumn>
    <UTable
      ref="table"
      v-model:row-selection="rowSelection"
      :get-row-id="getRowId"
      :loading="loading"
      :columns="canSelect ? [{ id: selectColumnId }, ...columns] : columns"
      :data="data"
      sticky
      class="max-h-[calc(100vh-140px)]"
    >
      <template #[`${selectColumnId}-header`]="{ table }">
        <UCheckbox
          :model-value="table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected()"
          @update:model-value="(value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value)"
        />
      </template>
      <template #[`${selectColumnId}-cell`]="{ row }">
        <UCheckbox
          :model-value="row.getIsSelected()"
          @update:model-value="(value: boolean | 'indeterminate') => row.toggleSelected(!!value)"
        />
      </template>
      <template
        v-for="(_, name) in $slots"
        :key="name"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData"
        />
      </template>
    </UTable>
    <Pagination
      :model-value="page"
      :limit="limit"
      :total="total"
      :hide-pagination="hidePagination"
      :can-select="canSelect"
      :selected-row-count="selectedRowCount"
      :row-count="rowCount"
      @update:model-value="updatePage"
      @update:limit="updateLimit"
    />
  </div>
</template>
