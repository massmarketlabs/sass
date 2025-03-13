<script setup lang="ts">
definePageMeta({
  auth: false
})

const auth = useAuth()
const toast = useToast()

const state = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)

async function signIn() {
  if (loading.value)
    return
  loading.value = true
  const { error } = await auth.signIn.email({
    email: state.email,
    password: state.password
  })
  if (error) {
    toast.add({
      title: error.message,
      color: 'error'
    })
  }
  else {
    await navigateTo('/user')
    toast.add({
      title: 'Login Success'
    })
  }
  loading.value = false
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <UIcon
            name="i-heroicons-user-circle"
            class="text-4xl mb-2"
          />
          <h2 class="text-xl font-semibold">
            Welcome Back
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-3">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-simple-icons-google"
            @click="auth.signIn.social({ provider: 'google', callbackURL: '/user' })"
          >
            Google
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-simple-icons-facebook"
            @click="auth.signIn.social({ provider: 'facebook', callbackURL: '/user' })"
          >
            Facebook
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-simple-icons-apple"
            @click="auth.signIn.social({ provider: 'apple', callbackURL: '/user' })"
          >
            Apple
          </UButton>
        </div>

        <UDivider label="Or" />

        <UForm
          :state="state"
          class="space-y-4"
          @submit="signIn"
        >
          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="state.email"
              type="email"
              placeholder="Email Address"
              required
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
          >
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Password"
              required
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <UCheckbox
              v-model="state.rememberMe"
              label="Remember me"
            />
            <UButton
              variant="link"
              color="primary"
              to="/forgot-password"
            >
              Forgot your password?
            </UButton>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            Sign In
          </UButton>
        </UForm>

        <div class="text-center text-sm">
          Don't have an account?
          <UButton
            variant="link"
            color="primary"
            to="/register"
          >
            Create today!
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
