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

// Group features by category
const features = {
  foundation: [
    {
      icon: 'i-lucide-layout-template',
      title: 'Modern Tech Stack',
      description: 'Built with Nuxt, ready for Nuxt v4, TypeScript and Vue 3 Composition API'
    },
    {
      icon: 'i-lucide-shield-check',
      title: 'Secure Auth',
      description: 'A robust authentication system powered by Better Auth, providing OAuth2 social logins (Google, GitHub, etc.), sign-in/up, and email-based password reset capabilities.'
    },
    {
      icon: 'i-lucide-database',
      title: 'Enterprise Database',
      description: 'PostgreSQL with Drizzle ORM for type-safe operations'
    }
  ],
  integration: [
    {
      icon: 'i-lucide-mail',
      title: 'Email Integration',
      description: 'Built-in Resend integration for transactional emails'
    },
    {
      icon: 'i-lucide-credit-card',
      title: 'Payment Ready',
      description: 'Stripe integration for subscription management'
    },
    {
      icon: 'i-lucide-box',
      title: 'No Vendor Lock-in',
      description: 'Modular architecture with swappable components'
    }
  ],
  experience: [
    {
      icon: 'i-lucide-palette',
      title: 'Modern UI Design',
      description: 'Beautiful components with Nuxt UI and TailwindCSS'
    },
    {
      icon: 'i-lucide-languages',
      title: 'I18n Ready',
      description: 'Built-in support for multiple languages'
    },
    {
      icon: 'i-lucide-smartphone',
      title: 'Responsive Layout',
      description: 'Optimized for all devices and screen sizes'
    }
  ],
  developer: [
    {
      icon: 'i-lucide-code',
      title: 'Developer Friendly',
      description: 'ESLint + TypeScript for better development'
    },
    {
      icon: 'i-lucide-timer',
      title: 'Quick Setup',
      description: 'Start developing in minutes'
    },
    {
      icon: 'i-lucide-settings',
      title: 'Customizable',
      description: 'Easily extend and customize components'
    }
  ]
}
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
        class="relative py-24 bg-gray-50/50 dark:bg-gray-900/50"
      >
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">
              Everything you need to build your SaaS
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A complete solution with all the features you need to build, launch and scale your SaaS product
            </p>
          </div>

          <!-- Feature Groups -->
          <div class="space-y-24">
            <div
              v-for="(group, key) in features"
              :key="key"
              class="space-y-8"
            >
              <h3 class="text-xl font-semibold capitalize text-center">
                {{ key }}
              </h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UCard
                  v-for="feature in group"
                  :key="feature.title"
                  class="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <div class="flex gap-4 items-start p-2">
                    <div class="shrink-0">
                      <div class="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
                        <UIcon
                          :name="feature.icon"
                          class="text-primary-500 w-5 h-5"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="font-medium mb-2">
                        {{ feature.title }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ feature.description }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </NuxtLayout>
</template>
