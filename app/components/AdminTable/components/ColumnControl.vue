<script setup lang="ts" generic="T">
const { columns } = defineProps<{
  columns: AdminTableColumn<T>[]
}>()

const model = defineModel<string[]>('model', { default: [] })

const columnOptions = computed(() => columns.filter(column => column.accessorKey !== 'actions'))

const columnItems = computed(() => columnOptions.value.map(column => ({
  label: column.header,
  type: 'checkbox' as const,
  checked: model.value.includes(column.accessorKey),
  onUpdateChecked(checked: boolean) {
    const newSelectedColumns = [...model.value]
    if (checked) {
      newSelectedColumns.push(column.accessorKey)
    } else {
      const index = newSelectedColumns.indexOf(column.accessorKey)
      if (index > -1) {
        newSelectedColumns.splice(index, 1)
      }
    }
    model.value = newSelectedColumns
  }
})))
</script>

<template>
  <UDropdownMenu
    v-if="columnOptions.length"
    arrow
    :items="columnItems"
    size="sm"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-settings-2"
      size="sm"
    />
  </UDropdownMenu>
</template>
