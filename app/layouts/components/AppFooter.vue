<script lang="ts" setup>
const { t } = usei18n()
</script>

<template>
  <footer class="w-full border-t border-gray-200 dark:border-gray-800 py-4">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-2">
          <UIcon name="i-lucide-code" />
          <span>{{ t('app.name') }}</span>
          <USeparator
            orientation="vertical"
            class="hidden md:block"
          />
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} All rights reserved
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <ClientOnly>
            <ColorModeToggler />
          </ClientOnly>
          <UButton
            icon="i-simple-icons-github"
            variant="ghost"
            color="neutral"
            href="https://github.com/NuxSaaS/NuxSaaS"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
