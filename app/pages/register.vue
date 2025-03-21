<script setup lang="ts">
definePageMeta({
  auth: false
})

const auth = useAuth()
const toast = useToast()

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
})

type Schema = zodOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined
})

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (loading.value)
    return
  loading.value = true
  const { error } = await auth.signUp.email({
    name: event.data.name,
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
      title: 'Registration Success',
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
            Create your account
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
            label="Name"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              placeholder="Your Name"
            />
          </UFormField>

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

          <UFormField
            label="Confirm Password"
            name="confirmPassword"
            required
          >
            <UInput
              v-model="state.confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            Create Account
          </UButton>
        </UForm>

        <div class="text-center text-sm">
          Already have an account?
          <UButton
            variant="link"
            color="primary"
            to="/login"
          >
            Sign in here
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
