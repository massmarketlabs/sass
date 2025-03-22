<script setup lang="ts">
definePageMeta({
  layout: false
})
const { user } = useAuth()
if (!user.value) {
  await navigateTo('/login')
} else {
  if (user.value.role !== 'admin') {
    await navigateTo('/403')
  }
}
</script>

<template>
  <NuxtPage />
</template>
