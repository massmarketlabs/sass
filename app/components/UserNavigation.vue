<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()
const { loggedIn, signOut, user, subscription } = useAuth()

const { data: subscriptions } = await useAsyncData('/subscriptions', () => subscription.list())

const activeSubscription = computed(() => {
  return subscriptions.value?.data?.find(
    sub => sub.status === 'active' || sub.status === 'trialing'
  )
})
</script>

<template>
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
        <span>
          {{ user?.name }}
          <UBadge
            v-if="activeSubscription"
            label="Pro"
          />
        </span>
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
</template>
