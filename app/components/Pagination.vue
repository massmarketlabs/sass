<script setup lang="ts">
const { total } = defineProps({
  total: { type: Number, default: 0 }
})
const emit = defineEmits<{
  change: []
}>()
const { t } = useI18n()
const page = defineModel('page', { default: 1 })
const limit = defineModel('limit', { default: 20 })
const sizes = [5, 20, 50, 100]

watch(
  page,
  () => {
    emit('change')
  },
  { immediate: true }
)
</script>

<template>
  <div class="w-full flex items-center justify-center">
    <span class="mr-4"><span class="text-xs">{{ t('total') }}:</span> {{ total }}</span>
    <UPagination
      v-model:page="page"
      :items-per-page="limit"
      :total="total"
      show-edges
    />
    <span class="ml-4 mr-1 text-xs">{{ t('perPage') }}</span>
    <USelect
      v-model="limit"
      :items="sizes"
      @change="emit('change')"
    />
  </div>
</template>
