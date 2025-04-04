<i18n src="./i18n.json"></i18n>

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
const totalPage = computed(() => {
  return Math.ceil(total / limit.value)
})
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
  <div class="w-full flex items-center justify-between">
    <span class="mr-4 text-sm"><span class="text-sm">{{ t('pagination.total') }}:</span> {{ total }}</span>
    <div class="flex items-center">
      <span class="ml-4 mr-1 text-sm hidden sm:block">{{ t('pagination.rowsPerPage') }}</span>
      <USelect
        v-model="limit"
        :items="sizes"
        size="sm"
        @change="emit('change')"
      />
      <span class="ml-4 mr-4 text-sm">{{ t('pagination.pageOf', { page, totalPage }) }}</span>
      <UPagination
        v-model:page="page"
        :items-per-page="limit"
        :total="total"
        show-edges
        size="sm"
      />
    </div>
  </div>
</template>
