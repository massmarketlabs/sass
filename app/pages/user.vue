<script setup lang="ts">
// https://better-auth.vercel.app/docs/integrations/nuxt#ssr-usage
const { user, session, client } = useAuth()
const toast = useToast()
const { data: accounts } = await useAsyncData('/accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some(account => account.provider === provider)
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const error = useRoute().query?.error
onMounted(() => {
  if (error) {
    toast.add({
      color: 'error',
      title: `${error}`
    })
  }
})
</script>

<template>
  <UContainer>
    <div class="space-y-6">
      <!-- User Profile Section -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-4">
            <UAvatar
              v-if="user?.image"
              :src="user.image"
              :alt="user?.name || ''"
              size="lg"
            />
            <div>
              <h1 class="text-2xl font-bold">
                {{ user?.name || 'Anonymous User' }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                {{ user?.email }}
              </p>
            </div>
          </div>
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            icon="i-heroicons-arrow-left"
          >
            Back
          </UButton>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <p class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Role:</span>
              <UBadge :color="user?.role === 'admin' ? 'primary' : 'neutral'">
                {{ user?.role }}
              </UBadge>
            </p>
            <p class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Email Verified:</span>
              <UBadge :color="user?.emailVerified ? 'success' : 'warning'">
                {{ user?.emailVerified ? 'Verified' : 'Not Verified' }}
              </UBadge>
            </p>
          </div>
          <div class="space-y-2">
            <p class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Created:</span>
              <span>{{ formatDate(user?.createdAt) }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Last Updated:</span>
              <span>{{ formatDate(user?.updatedAt) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Session Information -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">
          Session Information
        </h2>
        <div class="space-y-2">
          <p class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">IP Address:</span>
            <span>{{ session?.ipAddress }}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Expires:</span>
            <span>{{ formatDate(session?.expiresAt) }}</span>
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            User Agent:
          </p>
          <p class="text-sm break-all">
            {{ session?.userAgent }}
          </p>
        </div>
      </div>

      <!-- Connected Accounts -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">
          Connected Accounts
        </h2>
        <div class="flex gap-2">
          <UButton
            v-if="hasProvider('github')"
            color="neutral"
            icon="i-simple-icons-github"
            trailing-icon="i-heroicons-check"
          >
            Linked with GitHub
          </UButton>
          <UButton
            v-else
            color="neutral"
            icon="i-simple-icons-github"
            @click="client.linkSocial({ provider: 'github' })"
          >
            Link account with GitHub
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>
