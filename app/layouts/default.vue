<script lang="ts" setup>
import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center relative bg-gray-100 dark:bg-gray-950">
    <AppNavbar />
    <div class="flex flex-1">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
