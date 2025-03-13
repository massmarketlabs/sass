<template>
  <UButton
    :icon="$colorMode.preference == 'light' ? 'i-lucide-moon' : 'i-lucide-sun'"
    color="neutral"
    variant="ghost"
    @click="$colorMode.preference = $colorMode.preference == 'light' ? 'dark' : 'light'"
  />
</template>
