<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false
})

const { t } = useI18n()

useHead({
  title: t('signIn.signIn')
})

const auth = useAuth()
const toast = useToast()

const schema = z.object({
  email: z.string().email(t('signIn.errors.invalidEmail')),
  password: z.string().min(8, t('signIn.errors.passwordLength', { min: 8 })),
  rememberMe: z.boolean().optional()
})
type Schema = zodOutput<typeof schema>

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
      title: t('signIn.signInSuccess'),
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
            {{ t('signIn.welcome', { name: t('global.appName') }) }}
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

        <USeparator :label="t('signIn.or')" />

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            :label="t('signIn.email')"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              class="w-full"
              :placeholder="t('signIn.emailPlaceholder')"
            />
          </UFormField>

          <UFormField
            :label="t('signIn.password')"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              class="w-full"
              :placeholder="t('signIn.passwordPlaceholder')"
            />
          </UFormField>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <UFormField name="rememberMe">
              <UCheckbox
                v-model="state.rememberMe"
                :label="t('signIn.rememberMe')"
              />
            </UFormField>
            <UButton
              variant="link"
              color="neutral"
              to="/forgot-password"
            >
              {{ t('signIn.forgotPassword') }}
            </UButton>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            {{ t('signIn.signIn') }}
          </UButton>

          <div class="text-center text-sm">
            {{ t('signIn.noAccount') }}
            <UButton
              variant="link"
              color="neutral"
              to="/register"
            >
              {{ t('signIn.createAccount') }}
            </UButton>
          </div>
        </uform>
      </div>
    </UCard>
  </UContainer>
</template>
