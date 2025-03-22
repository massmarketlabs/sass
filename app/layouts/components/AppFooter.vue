<template>
  <footer class="w-full border-t border-gray-200 dark:border-gray-800 py-4">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-2">
          <UIcon name="i-lucide-code" />
          <span>NuxtFusion</span>
          <USeparator
            orientation="vertical"
            class="hidden md:block"
          />
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} All rights reserved
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <ColorModeToggler />
          <UButton
            icon="i-simple-icons-github"
            variant="ghost"
            color="neutral"
            href="https://github.com/Cyanhall/NuxtFusion"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
