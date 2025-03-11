<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="mb-6 text-2xl font-bold text-center">登录</h1>
      
      <div class="space-y-4">
        <UButton
          v-for="provider in providers"
          :key="provider.id"
          :label="`使用 ${provider.name} 登录`"
          block
          @click="() => signIn(provider.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const { $auth } = useNuxtApp()
const providers = computed(() => $auth.getProviders())

function signIn(providerId) {
  $auth.signIn(providerId)
}
</script>