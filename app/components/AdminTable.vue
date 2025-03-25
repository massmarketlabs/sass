<script setup lang="ts" generic="T">
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

const defaultSelectedColumns: Array<string> = []
const columnOptions: Array<AdminTableColumn<T>> = []
for (const column of columns) {
  defaultSelectedColumns.push(column.accessorKey)
  if (column.accessorKey != 'actions') {
    columnOptions.push(column)
  }
}
const selectedColumns = reactive(defaultSelectedColumns)
const tableRef = useTemplateRef('table')

watchEffect(() => {
  for (const column of columns) {
    if (selectedColumns.includes(column.accessorKey)) {
      tableRef.value?.tableApi?.getColumn(column.accessorKey)?.toggleVisibility(true)
    } else {
      tableRef.value?.tableApi?.getColumn(column.accessorKey)?.toggleVisibility(false)
    }
  }
})

const columnItems = computed(() => columnOptions.map(column => ({
  label: column.header,
  type: 'checkbox' as const,
  checked: selectedColumns.includes(column.accessorKey),
  onUpdateChecked(checked: boolean) {
    if (checked) {
      selectedColumns.push(column.accessorKey)
    }
    else {
      const index = selectedColumns.indexOf(column.accessorKey)
      if (index > -1)
        selectedColumns.splice(index, 1)
    }
  }
})))

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
  return true
}
const updatePage = (value: number) => {
  page.value = value
  fetchTableData()
}

const updateLimit = (value: number) => {
  limit.value = value
  fetchTableData()
}

onMounted(() => {
  fetchTableData()
})
</script>

<template>
  <div>
    <ThreeColumn>
      <template #left>
        <slot name="topLeft" />
      </template>
      <template #right>
        <slot name="topRight" />
        <UDropdownMenu
          v-if="columnOptions.length"
          arrow
          :items="columnItems"
          size="sm"
        >
          <UButton
            color="primary"
            variant="outline"
            icon="i-lucide-columns-2"
            size="sm"
          />
        </UDropdownMenu>
      </template>
    </ThreeColumn>
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
