<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false
})

const { t } = useI18n()
const auth = useAuth()
const toast = useToast()

const schema = z.object({
  name: z.string().min(5, t('register.form.name.error', { min: 5 })),
  email: z.string().email(t('register.form.email.error')),
  password: z.string().min(8, t('register.form.password.error', { min: 8 })),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: t('register.form.confirmPassword.error'),
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
      title: t('register.success'),
      color: 'success'
    })
  }
  loading.value = false
}
</script>

<template>
  <UContainer class="flex items-center justify-center p-4 min-w-100 sm:min-w-160">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center p-4">
          <h2 class="text-xl font-semibold">
            {{ t('register.title') }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-simple-icons-google"
            class="justify-center"
            @click="auth.signIn.social({ provider: 'google', callbackURL: '/user' })"
          >
            Google
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-simple-icons-github"
            class="justify-center"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
          >
            Github
          </UButton>
        </div>

        <USeparator :label="t('register.or')" />

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            :label="t('register.form.name.label')"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              :placeholder="t('register.form.name.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('register.form.email.label')"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              :placeholder="t('register.form.email.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('register.form.password.label')"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              :placeholder="t('register.form.password.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('register.form.confirmPassword.label')"
            name="confirmPassword"
            required
          >
            <UInput
              v-model="state.confirmPassword"
              type="password"
              :placeholder="t('register.form.confirmPassword.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            {{ t('register.submit') }}
          </UButton>
        </UForm>

        <div class="text-center text-sm">
          {{ t('register.haveAccount') }}
          <UButton
            variant="link"
            color="primary"
            to="/login"
          >
            {{ t('register.signIn') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
