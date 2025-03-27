<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import CreateUserModal from './components/CreateUserModal.vue'

const { t } = useI18n()
const { client } = useAuth()
const isUserModalOpen = ref(false)

const { refresh } = useAdminTable()

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
  },
  {
    accessorKey: 'actions',
    header: ' ',
    cell: ({ row }) => actionColumn(row, getRowItems)
  }
]

function getRowItems(row: Row<UserWithRole>) {
  const user = row.original
  return [
    {
      type: 'label',
      label: t('actions')
    },
    {
      type: 'separator'
    },
    {
      label: t('delete'),
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        const removeResult = await client.admin.removeUser({
          userId: user.id
        })
        if (removeResult.data?.success) {
          refresh()
        } else {
          console.error(removeResult.error)
        }
      }
    }
  ]
}

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
        @click="isUserModalOpen = true"
      >
        {{ t('actions.createUser') }}
      </UButton>
    </template>
    <AdminTable
      ref="table"
      :columns="columns"
      :fetch-data="fetchData"
    />
    <CreateUserModal
      v-model:open="isUserModalOpen"
      :t="t"
      @created="refresh"
    />
  </NuxtLayout>
</template>
