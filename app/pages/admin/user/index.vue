<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import CreateUserModal from './components/CreateUserModal.vue'

const { t } = useI18n()
const { client } = useAuth()
const isOpen = ref(false)

const columns: AdminTableColumn<UserWithRole>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: IDColumn
  },
  {
    accessorKey: 'avatar',
    header: t('columns.avatar'),
    cell: avatarColumn
  },
  {
    accessorKey: 'name',
    header: t('columns.name')
  },
  {
    accessorKey: 'email',
    header: t('columns.email')
  },
  {
    accessorKey: 'role',
    header: t('columns.role'),
    cell: cell => h(
      UBadge,
      {
        color: cell.getValue() === 'admin' ? 'primary' : 'neutral',
        variant: 'outline'
      },
      () => cell.getValue()
    )
  },
  {
    accessorKey: 'status',
    header: t('columns.status'),
    cell: ({ cell: { row: { original } } }) => h(
      UBadge,
      {
        color: original.banned ? 'error' : (original.emailVerified ? 'success' : 'warning'),
        label: original.banned ? t('status.banned') : (original.emailVerified ? t('status.verified') : t('status.unverified'))
      }
    )
  },
  {
    accessorKey: 'createdAt',
    header: t('columns.createdAt'),
    cell: dateColumn
  }
]

const sortBy = ref<SortBy>({ column: 'createdAt', direction: 'desc' })

const fetchData: FetchDataFn<UserWithRole> = async ({ page, limit }) => {
  const result = await client.admin.listUsers({
    query: {
      limit,
      offset: (page - 1) * limit,
      sortBy: sortBy.value.column,
      sortDirection: sortBy.value.direction
    }
  })
  return {
    data: result.data?.users || [],
    total: result.data?.total || 0
  }
}
</script>

<template>
  <NuxtLayout name="admin">
    <template #navRight>
      <UButton
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-plus"
        @click="isOpen = true"
      >
        {{ t('actions.createUser') }}
      </UButton>
    </template>
    <AdminTable
      :columns="columns"
      :fetch-data="fetchData"
    />
    <CreateUserModal
      v-model:open="isOpen"
      :t="t"
    />
  </NuxtLayout>
</template>
