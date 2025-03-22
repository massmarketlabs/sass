<script lang="ts" setup>
const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Documentation', href: '/docs' },
  { name: 'About', href: '/about' }
]

const { loggedIn, signOut, user } = useAuth()
</script>

<template>
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
    <UContainer class="flex h-16 items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-lucide-zap"
          class="h-6 w-6 text-primary-500"
        />
        <span class="font-bold text-xl">NuxtFusion</span>
      </NuxtLink>

      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="text-sm font-medium text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <template v-if="loggedIn">
          <UDropdownMenu
            :items="[
              {
                label: 'Profile',
                icon: 'i-lucide-user',
                to: '/profile'
              },
              {
                label: 'Sign out',
                icon: 'i-lucide-log-out',
                onSelect: () => signOut()
              }
            ]"
          >
            <UButton
              variant="ghost"
              color="neutral"
              class="flex items-center gap-2"
            >
              <UAvatar
                v-if="user?.image"
                :src="user?.image"
                :alt="user?.name"
                size="sm"
              />
              <span>{{ user?.name }}</span>
            </UButton>
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton
            to="/login"
            variant="ghost"
          >
            Sign in
          </UButton>
          <UButton
            to="/login"
            color="primary"
          >
            Get started
          </UButton>
        </template>
      </div>
    </UContainer>
  </nav>
</template>
