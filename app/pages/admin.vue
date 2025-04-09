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
</script>

<template>
  <NuxtPage />
</template>
