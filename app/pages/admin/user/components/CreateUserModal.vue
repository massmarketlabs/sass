<script setup lang="ts">
const { t } = defineProps<{
  t: TranFunction
}>()

const emit = defineEmits<{
  created: []
  cancel: []
}>()

const open = defineModel('open', { default: false })
const { client } = useAuth()

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin'])
})
type Schema = zodOutput<typeof schema>

const state = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user' as const
})

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  const res = await client.admin.createUser({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role
  })
  if (res) {
    open.value = false
    emit('created')
  }
}

const onCancel = () => {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :close="true"
    :title="t('modal.createUser')"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('form.name')"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('form.email')"
          name="email"
        >
          <UInput
            v-model="state.email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('form.password')"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('form.role')"
          name="role"
        >
          <USelect
            v-model="state.role"
            class="w-full"
            :items="[
              { label: t('roles.user'), value: 'user' },
              { label: t('roles.admin'), value: 'admin' }
            ]"
          />
        </UFormField>

        <div class="flex justify-end w-full gap-4">
          <UButton
            color="neutral"
            variant="soft"
            @click="onCancel"
          >
            {{ t('actions.cancel') }}
          </UButton>
          <UButton
            type="submit"
            color="primary"
          >
            {{ t('actions.create') }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
