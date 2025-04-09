<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false
})

const { t } = useI18n()

useHead({
  title: t('signUp.pageTitle')
})

const auth = useAuth()
const toast = useToast()
const route = useRoute()
const config = useRuntimeConfig()

const redirectTo = computed(() => {
  const redirect = route.query.redirect as string
  return redirect || config.public.auth.authenticatedRedirect
})

const schema = z.object({
  name: z.string().min(5, t('signUp.form.name.error', { min: 5 })),
  email: z.string().email(t('signUp.form.email.error')),
  password: z.string().min(8, t('signUp.form.password.error', { min: 8 })),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: t('signUp.form.confirmPassword.error'),
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
    await navigateTo(redirectTo.value)
    toast.add({
      title: t('signUp.success'),
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
            {{ t('signUp.title') }}
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
            @click="auth.signIn.social({ provider: 'google', callbackURL: redirectTo })"
          >
            Google
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-simple-icons-github"
            class="justify-center"
            @click="auth.signIn.social({ provider: 'github', callbackURL: redirectTo })"
          >
            Github
          </UButton>
        </div>

        <USeparator :label="t('signUp.or')" />

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            :label="t('signUp.form.name.label')"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              :placeholder="t('signUp.form.name.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('signUp.form.email.label')"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              :placeholder="t('signUp.form.email.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('signUp.form.password.label')"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              :placeholder="t('signUp.form.password.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('signUp.form.confirmPassword.label')"
            name="confirmPassword"
            required
          >
            <UInput
              v-model="state.confirmPassword"
              type="password"
              :placeholder="t('signUp.form.confirmPassword.placeholder')"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            {{ t('signUp.submit') }}
          </UButton>
        </UForm>

        <div class="text-center text-sm">
          {{ t('signUp.haveAccount') }}
          <UButton
            variant="link"
            color="primary"
            to="/signin"
          >
            {{ t('signUp.signIn') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
