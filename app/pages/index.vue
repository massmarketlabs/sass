<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false
})

const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const navigation = [
  { name: t('global.nav.features'), href: localePath('/#features') },
  { name: t('global.nav.pricing'), href: localePath('/pricing') }
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
</script>

<template>
  <NuxtLayout name="default">
    <template #nav-center>
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="localePath(item.href)"
          class="text-sm font-medium text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </template>
    <template #nav-right>
      <div class="flex items-center gap-2">
        <UserNavigation />
      </div>
    </template>
    <div class="pt-16">
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800" />
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl opacity-50" />
        <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -ml-32 -mt-32 opacity-30" />
      </div>
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <UContainer class="relative py-24">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              {{ t('global.appName') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {{ t('global.appSlogan') }}
            </p>
            <div class="flex gap-4 justify-center">
              <UButton
                :to="localePath('/signin')"
                color="primary"
                size="lg"
              >
                Get Started
              </UButton>
              <UButton
                :to="runtimeConfig.public.appRepo"
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
      <section
        id="features"
        class="relative py-24"
      >
        <!-- Background gradient for features -->
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-gradient-to-b from-white via-emerald-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800" />
        </div>
        <UContainer class="relative">
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
              class="text-center backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg"
            >
              <div class="flex flex-col items-center p-6">
                <div class="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-full mb-4">
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
  </NuxtLayout>
</template>
