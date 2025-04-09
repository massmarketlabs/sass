<script setup lang="ts">
definePageMeta({
  layout: false
})
const { user } = useAuth()
const route = useRoute()
const appConfig = useRuntimeConfig()
if (!user.value) {
  await navigateTo(appConfig.public.auth.unauthenticatedRedirect)
} else {
  if (user.value.role !== 'admin') {
    await navigateTo('/403')
  }
}

// admin___en
const routeParts = (route.name as string).split('___')
const routeName = routeParts[0]
const localeCode = routeParts[1]
const localePrefix = localeCode == 'en' ? '' : `/${localeCode}`

if (routeName === 'admin') {
  await navigateTo(`${localePrefix}/admin/dashboard`)
}
</script>

<template>
  <NuxtPage />
</template>
