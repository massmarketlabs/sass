<script setup lang="ts">
definePageMeta({
  auth: false
})

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Documentation', href: '/docs' },
  { name: 'About', href: '/about' }
]

const features = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Modern Stack',
    description: 'Built with Nuxt 3, TypeScript and Vue 3 Composition API'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Authentication Ready',
    description: 'Integrated with Better Auth for secure authentication'
  },
  {
    icon: 'i-lucide-database',
    title: 'Database Integration',
    description: 'PostgreSQL with Drizzle ORM for type-safe database operations'
  },
  {
    icon: 'i-lucide-palette',
    title: 'Beautiful UI',
    description: 'Styled with Nuxt UI and TailwindCSS for modern design'
  },
  {
    icon: 'i-lucide-moon',
    title: 'Dark Mode',
    description: 'Built-in dark mode support for better user experience'
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Responsive Design',
    description: 'Fully responsive layout for all devices'
  }
]

const { loggedIn, signOut, user } = useAuth()
</script>

<template>
  <div>
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

    <!-- Add padding to account for fixed navbar -->
    <div class="pt-16">
      <!-- Hero Section -->
      <section class="bg-gray-50 dark:bg-gray-900">
        <UContainer class="py-24">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              NuxtFusion
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
              A modern SaaS starter kit built with Nuxt 3
            </p>
            <div class="flex gap-4 justify-center">
              <UButton
                to="/login"
                color="primary"
                size="lg"
              >
                Get Started
              </UButton>
              <UButton
                to="https://github.com/your-repo/nuxtfusion"
                target="_blank"
                color="neutral"
                variant="outline"
                size="lg"
                icon="i-simple-icons-github"
              >
                View on GitHub
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Features Section -->
      <section class="py-24">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold">
              Everything you need to build your SaaS
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Start your next project with our feature-rich template
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UCard
              v-for="feature in features"
              :key="feature.title"
              class="text-center"
            >
              <div class="flex flex-col items-center p-6">
                <div class="p-3 bg-primary-50 dark:bg-primary-900 rounded-full mb-4">
                  <UIcon
                    :name="feature.icon"
                    class="text-primary-500 w-6 h-6"
                  />
                </div>
                <h3 class="text-lg font-semibold mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ feature.description }}
                </p>
              </div>
            </UCard>
          </div>
        </UContainer>
      </section>
    </div>
  </div>
</template>
