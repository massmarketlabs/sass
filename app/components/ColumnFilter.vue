<script setup lang="ts">
const { items, name } = defineProps<{
  items: FilterItem[]
  name: string
}>()
const filter = defineModel<string[]>('filter', { default: [] })
const selectedItems = computed(() => {
  return items.filter(item => filter.value.includes(item.id))
})
const onUpdateChecked = (checked: string | boolean, item: FilterItem) => {
  if (checked) {
    filter.value.push(item.id)
  } else {
    filter.value.splice(filter.value.indexOf(item.id), 1)
  }
}
</script>

<template>
  <UPopover
    :content="{
      align: 'start',
      side: 'bottom'
    }"
  >
    <UButton
      color="neutral"
      variant="subtle"
    >
      <UIcon
        v-if="selectedItems.length"
        name="i-lucide-circle-x"
        class="w-4 h-4 mr-1"
        @click.stop="filter = []"
      />
      <UIcon
        v-if="!selectedItems.length"
        name="i-lucide-filter"
        class="w-4 h-4 mr-1"
      />
      {{ name }}
      <template v-if="selectedItems.length">
        <UBadge
          v-for="item in selectedItems"
          :key="item.id"
          color="neutral"
          variant="outline"
          size="sm"
          class="ml-1"
        >
          {{ item.label }}
        </UBadge>
      </template>
    </UButton>

    <template #content>
      <div class="flex flex-col p-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center"
        >
          <UCheckbox
            :key="item.id"
            :model-value="filter.includes(item.id)"
            :ui="{
              wrapper: 'flex-1'
            }"
            class="p-1 flex-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            @update:model-value="(e) => onUpdateChecked(e, item)"
          >
            <template #label>
              <div class="flex items-center">
                <span class="flex-1">{{ item.label }}</span>
                <UBadge
                  v-if="item.count != undefined"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  class="ml-2"
                >
                  {{ item.count }}
                </UBadge>
              </div>
            </template>
          </UCheckbox>
        </div>
      </div>
    </template>
  </UPopover>
</template>
