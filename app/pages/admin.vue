<script setup lang="ts">
definePageMeta({
  layout: false
})
const { user } = useAuth()
const appConfig = useRuntimeConfig()
if (!user.value) {
  await navigateTo(appConfig.public.auth.unauthenticatedRedirect)
} else {
  if (user.value.role !== 'admin') {
    await navigateTo('/403')
  }
}
const localePath = useLocalePath()
const { routeName } = useLocaleRouteName()

if (routeName === 'admin') {
  await navigateTo(localePath('/admin/dashboard'))
}
</script>

<template>
  <NuxtPage />
</template>
