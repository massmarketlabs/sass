<script lang="ts" setup>
import * as locales from '@nuxt/ui/locale'

const { t, locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  htmlAttrs: {
    lang,
    dir
  },
  titleTemplate: (title) => {
    if (title) {
      if (title.includes(t('global.appName'))) {
        return title
      } else {
        return `${title} | ${t('global.appName')}`
      }
    } else {
      return t('global.appName')
    }
  }
})
useSeoMeta({
  ogSiteName: t('global.appName')
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
