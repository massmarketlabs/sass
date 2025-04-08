<script lang="ts" setup>
import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center relative">
    <AppNavbar />
    <div class="flex flex-1 pt-16">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
