<script setup lang="ts" generic="T">
import type { UTableInstance } from './types'
import ColumnControl from './components/ColumnControl.vue'
import SortControl from './components/SortControl/index.vue'
import useColumnControl from './composables/useColumnControl'
import useSortControl from './composables/useSortControl'

const { fetchData, columns, hidePagination = false } = defineProps<{
  fetchData: FetchDataFn<T>
  columns: AdminTableColumn<T>[]
  hidePagination?: boolean
}>()

const page = ref<number>(1)
const limit = ref<number>(20)
const loading = ref(false)
const total = ref(0)
const data = ref<any[]>([])

const tableRef = useTemplateRef<UTableInstance>('table')
const { selectedColumns } = useColumnControl(columns, tableRef)
const { sortOptions } = useSortControl(columns, tableRef)

const fetchTableData = async () => {
  loading.value = true
  try {
    const result = await fetchData({
      page: page.value,
      limit: limit.value
    })
    data.value = result.data || []
    total.value = result.total || 0
  } finally {
    loading.value = false
  }
}

watch(
  () => sortOptions.value,
  fetchTableData,
  { immediate: true }
)

const updatePage = (value: number) => {
  page.value = value
  fetchTableData()
}

const updateLimit = (value: number) => {
  limit.value = value
  fetchTableData()
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
        <slot name="topLeft" />
      </template>
      <template #right>
        <slot name="topRight" />
        <UButton
          :color="refreshSuccess ? 'success' : 'neutral'"
          variant="outline"
          :icon="loading ? 'i-lucide-loader-2' : (refreshSuccess ? 'i-lucide-check' : 'i-lucide-refresh-cw')"
          size="sm"
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
      :loading="loading"
      :columns="columns"
      :data="data"
      sticky
      size="sm"
      class="max-h-[calc(100vh-140px)]"
    />
    <Pagination
      v-if="!hidePagination"
      :model-value="page"
      :limit="limit"
      :total="total"
      @update:model-value="updatePage"
      @update:limit="updateLimit"
    />
  </div>
</template>
