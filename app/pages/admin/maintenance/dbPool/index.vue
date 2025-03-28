<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { t } = useI18n()
const { data: poolStats } = await useFetch('/api/system/db-stats')
</script>

<template>
  <NuxtLayout name="admin">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UCard>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-primary-500">
            <Icon name="lucide:database" />
            <span class="text-xl">{{ poolStats?.totalCount || 0 }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('dbPool.totalConnections') }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-info-500">
            <Icon name="lucide:activity" />
            <span class="text-xl">{{ poolStats?.activeConnections || 0 }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('dbPool.activeConnections') }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-success-500">
            <Icon name="lucide:pause" />
            <span class="text-xl">{{ poolStats?.idleCount || 0 }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('dbPool.idleConnections') }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-warning-500">
            <Icon name="lucide:clock" />
            <span class="text-xl">{{ poolStats?.waitingCount || 0 }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('dbPool.waitingConnections') }}
          </p>
        </div>
      </UCard>
    </div>

    <div
      v-if="!poolStats"
      class="mt-4 text-center"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin"
      />
    </div>
  </NuxtLayout>
</template>
