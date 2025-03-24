<script setup lang="ts" generic="T">
const emit = defineEmits<{
  refresh: []
}>()
const columns = defineModel<AdminTableColumn<T>[]>('columns', { required: true })
const data = defineModel<T[]>('data', { default: [] })
const loading = defineModel<boolean>('loading', { default: false })
const hidePagination = defineModel<boolean>('hidePagination', { default: false })
const page = ref<number | undefined>(1)
const limit = ref<number | undefined>(20)
const total = ref(0)

const defaultSelectedColumns: Array<string> = []
const columnOptions: Array<AdminTableColumn<T>> = []
for (const column of columns.value) {
  defaultSelectedColumns.push(column.accessorKey)
  if (column.accessorKey != 'actions') {
    columnOptions.push(column)
  }
}
const selectedColumns = reactive(defaultSelectedColumns)
const tableRef = useTemplateRef('table')

watchEffect(() => {
  for (const column of columns.value) {
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
}))
)

const setPageTotal = (value: number) => {
  total.value = value
}

const onChangePagination = () => {
  nextTick(() => {
    emit('refresh')
  })
}

defineExpose({
  page,
  limit,
  setPageTotal
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
      v-model:page="page"
      v-model:limit="limit"
      :total="total"
      @change="onChangePagination"
    />
  </div>
</template>
