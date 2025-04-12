<script lang="ts" setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <!-- Navigation -->
  <nav class="fixed h-16 top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
    <UContainer class="flex h-full items-center justify-between">
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center gap-2"
      >
        <Logo class="w-8 h-8" />
        <span class="font-bold text-xl">{{ t('global.appName') }}</span>
      </NuxtLink>

      <slot name="center" />
      <slot name="right" />
    </UContainer>
  </nav>
</template>
