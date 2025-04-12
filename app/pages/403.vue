<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center">
    <div class="text-center">
      <UIcon
        name="lucide:shield-alert"
        class="mx-auto h-16 w-16 text-red-500 dark:text-red-400"
      />
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Access Denied
      </h1>
      <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
        Sorry, you don't have permission to access this page.
      </p>
      <div class="mt-6">
        <UButton
          :to="localePath('/')"
          icon="lucide:home"
          variant="soft"
        >
          Back to home
        </UButton>
      </div>
    </div>
  </div>
</template>
