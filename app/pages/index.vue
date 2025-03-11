<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})
const auth = useAuth()
const toast = useToast()
const tabs = [{
  slot: 'signin',
  label: 'Sign In',
  icon: 'i-heroicons-user',
}, {
  slot: 'signup',
  label: 'Sign Up',
  icon: 'i-heroicons-user-plus',
}]

const state = reactive({
  email: '',
  password: '',
  name: ''
})

const loading = ref(false)

async function signIn() {
  if (loading.value) return
  loading.value = true
  const { error } = await auth.signIn.email({
    email: state.email,
    password: state.password,
  })
  if (error) {
    toast.add({
      title: error.message,
      color: 'error',
    })
  }
  else {
    await navigateTo('/user')
    toast.add({
      title: `You have been signed in!`,
    })
  }
  loading.value = false
}

async function signUp() {
  if (loading.value) return
  loading.value = true
  const { error } = await auth.signUp.email({
    email: state.email,
    password: state.password,
    name: state.name,
  })
  if (error) {
    toast.add({
      title: error.message,
      color: 'error',
    })
  }
  else {
    toast.add({
      title: `You have been signed up!`,
    })
    await navigateTo('/user')
  }
  loading.value = false
}
</script>

<template>
    <UTabs :items="tabs" class="max-w-md mx-auto">
      <template #signin>
        <UForm :state="state" class="flex flex-col gap-4" @submit.prevent="signIn">
          <UFormField label="Email" required>
            <UInput v-model="state.email" type="email" placeholder="Email" />
          </UFormField>
          <UFormField label="Password" requiredrequired>
            <UInput v-model="state.password" type="password" placeholder="Password" />
          </UFormField>
          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="!state.email || !state.password"
          >
            Sign In
          </UButton>
          <USeparator label="or" />
          <UButton
            icon="i-simple-icons-github"
            type="button"
            color="primary"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
          >
            Sign In with Github
          </UButton>
        </UForm>
      </template>
      <template #signup>
        <UForm :state="state" class="flex flex-col gap-4" @submit.prevent="signUp">
          <UFormField label="Email" required>
            <UInput v-model="state.email" type="email" placeholder="Email" />
          </UFormField>
          <UFormField label="Password" requiredrequired>
            <UInput v-model="state.password" type="password" placeholder="Password" />
          </UFormField>
          <UFormField label="Name">
            <UInput v-model="state.name" type="name" placeholder="Name" />
          </UFormField>
          <UButton type="submit" color="primary" :loading="loading">
            Sign Up
          </UButton>
        </UForm>
      </template>
    </UTabs>
</template>