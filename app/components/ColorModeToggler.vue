<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <UButton
    :icon="colorMode.value == 'light' ? 'i-lucide-moon' : 'i-lucide-sun'"
    color="neutral"
    variant="ghost"
    @click="colorMode.value = $colorMode.value == 'light' ? 'dark' : 'light'"
  />
</template>
