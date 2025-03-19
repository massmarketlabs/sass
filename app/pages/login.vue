<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  auth: false
})

const auth = useAuth()
const toast = useToast()

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  rememberMe: false
})

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (loading.value)
    return
  loading.value = true
  const { error } = await auth.signIn.email({
    email: event.data.email,
    password: event.data.password
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
      title: 'Login Success',
      color: 'success'
    })
  }
  loading.value = false
}
</script>

<template>
  <UContainer class="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center p-4">
          <h2 class="text-xl font-semibold">
            Welcome to NuxtFusion
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UButton
            color="primary"
            variant="outline"
            icon="i-simple-icons-google"
            @click="auth.signIn.social({ provider: 'google', callbackURL: '/user' })"
          >
            Google
          </UButton>
          <UButton
            color="primary"
            variant="outline"
            icon="i-simple-icons-github"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
          >
            Github
          </UButton>
          <UButton
            color="primary"
            variant="outline"
            icon="i-simple-icons-apple"
            @click="auth.signIn.social({ provider: 'apple', callbackURL: '/user' })"
          >
            Apple
          </UButton>
        </div>

        <USeparator label="Or" />

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Email"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              placeholder="Email Address"
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Password"
            />
          </UFormField>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <UFormField name="rememberMe">
              <UCheckbox
                v-model="state.rememberMe"
                label="Remember me"
              />
            </UFormField>
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
  </UContainer>
</template>
