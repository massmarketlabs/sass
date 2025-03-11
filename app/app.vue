<script setup>
const { signOut, loggedIn } = useAuth()
</script>
<template>
  <UApp>
    <UButton v-if="loggedIn" color="black" @click="signOut({ redirectTo: '/' })">
        Sign Out
      </UButton>
    <USeparator />
    <NuxtPage />
  </UApp>
</template>