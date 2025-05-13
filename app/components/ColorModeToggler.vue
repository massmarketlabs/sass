<script setup lang="ts">
const colorMode = useColorMode()
const toggleColorMode = () => {
  if (colorMode.value == 'light') {
    colorMode.value = 'dark'
  } else {
    colorMode.value = 'light'
  }
}
</script>

<template>
  <UButton
    :icon="colorMode.value == 'light' ? 'i-lucide-moon' : 'i-lucide-sun'"
    color="neutral"
    variant="ghost"
    @click="toggleColorMode"
  />
</template>
