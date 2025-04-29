<script lang="ts" setup>
const { t } = useI18n()

useHead({
  titleTemplate: title => (title && title != t('global.appName') ? `${title} | ${t('global.appName')}` : t('global.appName'))
})
useSeoMeta({
  ogSiteName: t('global.appName')
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
