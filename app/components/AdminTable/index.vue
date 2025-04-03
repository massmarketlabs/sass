<script setup lang="ts" generic="T">
import type { UTableInstance } from './types'
import { useRoute, useRouter } from 'vue-router'
import ColumnControl from './components/ColumnControl.vue'
import Pagination from './components/Pagination/index.vue'
import SortControl from './components/SortControl/index.vue'
import useColumnControl from './composables/useColumnControl'

const { fetchData, columns, hidePagination = false } = defineProps<{
  fetchData: FetchDataFn<T>
  columns: AdminTableColumn<T>[]
  hidePagination?: boolean
}>()

const route = useRoute()
const router = useRouter()

const page = ref<number>(Number(route.query.page) || 1)
const limit = ref<number>(Number(route.query.limit) || 20)
const loading = ref(false)
const total = ref(0)
const data = ref<any[]>([])

const sortOptions = ref<SortOption[]>([])

const tableRef = useTemplateRef<UTableInstance>('table')
const { selectedColumns } = useColumnControl(columns, tableRef)

const fetchTableData = async () => {
  loading.value = true
  try {
    const result = await fetchData({
      page: page.value,
      limit: limit.value,
      sort: sortOptions.value
    })
    data.value = result.data || []
    total.value = result.total || 0
  } finally {
    loading.value = false
  }
}

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
