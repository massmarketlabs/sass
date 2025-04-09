<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <!-- Navigation -->
  <nav class="fixed h-16 top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
    <UContainer class="flex h-full items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-lucide-zap"
          class="h-6 w-6 text-primary-500"
        />
        <span class="font-bold text-xl">{{ t('global.appName') }}</span>
      </NuxtLink>

      <slot name="center" />
      <slot name="right" />
    </UContainer>
  </nav>
</template>
