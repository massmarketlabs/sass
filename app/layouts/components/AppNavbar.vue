<script lang="ts" setup>
const { signOut, loggedIn } = useAuth()
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="loggedIn"
      color="neutral"
      @click="signOut({ redirectTo: '/' })"
    >
      Sign Out
    </UButton>
    <ColorModeToggler class="absolute right-2 top-2" />
  </div>
</template>
