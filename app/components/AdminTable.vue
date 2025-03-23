<script setup lang="ts">
const emit = defineEmits<{
  refresh: []
}>()
const { t } = useI18n()
const columns = defineModel<any[]>('columns', { required: true })
const data = defineModel<any[]>('data', { default: [] })
const loading = defineModel<boolean>('loading', { default: false })
const hidePagination = defineModel<boolean>('hidePagination', { default: false })
const page = ref<number | undefined>(1)
const limit = ref<number | undefined>(20)
const total = ref(0)

const defaultSelectedColumns: Array<string> = []
const columnOptions: Array<any> = []
for (const column of columns.value) {
  defaultSelectedColumns.push(column.accessorKey)
  if (column.accessorKey != 'actions') {
    columnOptions.push(column)
  }
}
const selectedColumns = ref(defaultSelectedColumns)
const tableRef = useTemplateRef('table')

watchEffect(() => {
  for (const column of columns.value) {
    if (selectedColumns.value.includes(column.accessorKey)) {
      tableRef.value?.tableApi?.getColumn(column.accessorKey)?.toggleVisibility(true)
    } else {
      tableRef.value?.tableApi?.getColumn(column.accessorKey)?.toggleVisibility(false)
    }
  }
})

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
        <USelect
          v-model="selectedColumns"
          icon="i-lucide-columns-2"
          :items="columnOptions"
          size="sm"
          multiple
          label-key="header"
          value-key="accessorKey"
          class="w-30"
        >
          {{ t('columns') }}
        </USelect>
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
