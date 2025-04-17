<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false
})
const { t } = useI18n()
const { loggedIn, signOut, user } = useAuth()
const localePath = useLocalePath()

const navigation = [
  { name: t('global.nav.features'), href: localePath('/#features') },
  { name: t('global.nav.pricing'), href: localePath('/pricing') }
]
const billingPeriod = ref('monthly')

const plans = [
  {
    name: t('pricing.free.name'),
    description: t('pricing.free.description'),
    price: t('pricing.free.price'),
    period: t('pricing.free.period'),
    features: [
      t('pricing.free.feature1'),
      t('pricing.free.feature2')
    ],
    cta: t('pricing.cta.free'),
    color: 'neutral' as const
  },
  {
    name: t('pricing.pro.name'),
    description: t('pricing.pro.description'),
    price: t('pricing.pro.price', { price: 10 }),
    yearPrice: t('pricing.pro.price', { price: 100 }),
    period: t('pricing.pro.period'),
    features: [
      t('pricing.pro.feature1'),
      t('pricing.pro.feature2')
    ],
    cta: t('pricing.cta.pro'),
    color: 'primary' as const,
    popular: true
  },
  {
    name: t('pricing.enterprise.name'),
    description: t('pricing.enterprise.description'),
    price: t('pricing.enterprise.price'),
    period: t('pricing.enterprise.period'),
    features: [
      t('pricing.enterprise.feature1'),
      t('pricing.enterprise.feature2'),
      t('pricing.enterprise.feature3')
    ],
    cta: t('pricing.cta.enterprise'),
    color: 'neutral' as const
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
        <template v-if="loggedIn">
          <UDropdownMenu
            :items="[
              {
                label: t('global.auth.profile'),
                icon: 'i-lucide-user',
                to: localePath('/profile')
              },
              {
                label: t('global.auth.signOut'),
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
            :to="localePath('/signin')"
            variant="outline"
          >
            {{ t('global.auth.signIn') }}
          </UButton>
        </template>
      </div>
    </template>
    <UContainer class="space-y-6 pt-8 pb-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold">
          {{ t('pricing.title') }}
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400">
          {{ t('pricing.subtitle') }}
        </p>

        <!-- Billing toggle -->
        <div class="flex items-center justify-center gap-2 pt-2">
          <URadioGroup
            v-model:model-value="billingPeriod"
            orientation="horizontal"
            size="lg"
            :items="[
              { label: t('pricing.monthly'), value: 'monthly' },
              { label: t('pricing.yearly'), value: 'yearly' }
            ]"
          />
        </div>
      </div>
      <!-- Pricing cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="relative"
        >
          <UCard
            class="h-full flex flex-col"
            :class="[
              plan.popular && 'border-primary dark:border-primary'
            ]"
          >
            <div class="flex-1 space-y-6 w-[300px]">
              <div class="space-y-2">
                <h2 class="text-2xl font-bold">
                  {{ plan.name }}
                </h2>
                <p class="text-gray-500 dark:text-gray-400">
                  {{ plan.description }}
                </p>
              </div>

              <div class="space-y-1">
                <div class="text-3xl font-bold">
                  {{ billingPeriod === 'yearly' ? plan.yearPrice || plan.price : plan.price }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ plan.period }}
                </div>
              </div>

              <USeparator />

              <div class="space-y-4">
                <p class="font-medium">
                  {{ t('pricing.features.title') }}
                </p>
                <ul class="space-y-3">
                  <li
                    v-for="(feature, index) in plan.features"
                    :key="index"
                    class="flex items-start gap-2"
                  >
                    <UIcon
                      name="lucide:check"
                      class="flex-shrink-0 mt-1 text-green-500"
                    />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <template #footer>
              <UButton
                :color="plan.color"
                variant="solid"
                class="w-full justify-center"
              >
                {{ plan.cta }}
              </UButton>
            </template>
          </UCard>
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>
