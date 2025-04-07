<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import BanUserModal from './components/BanUserModal.vue'
import CreateUserModal from './components/CreateUserModal.vue'

const { t } = useI18n()
const { client } = useAuth()
const isUserModalOpen = ref(false)
const isBanModalOpen = ref(false)
const selectedUserId = ref('')

const search = ref('')

const roleFilter = ref([])
const roleOptions = ref<FilterItem[]>([
  { label: t('user.roles.user'), id: 'user', count: 0 },
  { label: t('user.roles.admin'), id: 'admin', count: 0 }
])

const statusFilter = ref([])
const statusOptions = ref<FilterItem[]>([
  { label: t('user.status.banned'), id: 'banned', count: 0 },
  { label: t('user.status.verified'), id: 'verified', count: 0 },
  { label: t('user.status.unverified'), id: 'unverified', count: 0 }
])

const createdAtRange = ref({
  start: undefined,
  end: undefined
})

const { refresh } = useAdminTable()

const getActionItems = (row: Row<UserWithRole>) => {
  const user = row.original
  return [
    {
      type: 'label',
      label: t('global.page.actions')
    },
    {
      type: 'separator'
    },
    {
      label: user.banned ? t('user.actions.unban') : t('user.actions.ban'),
      icon: 'i-lucide-ban',
      color: user.banned ? 'success' : 'error',
      async onSelect() {
        if (user.banned) {
          const result = await client.admin.unbanUser({
            userId: user.id
          })
          if (result.data?.user) {
            refresh()
          }
        } else {
          selectedUserId.value = user.id
          isBanModalOpen.value = true
        }
      }
    },
    {
      label: t('global.page.delete'),
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

const getRoleDropdownItems = (original: UserWithRole) => {
  const roles = ['user', 'admin'] as const
  return roles.map((role) => {
    return {
      label: t(`user.roles.${role}`),
      type: 'checkbox' as const,
      checked: original.role === role,
      onUpdateChecked: async () => {
        const result = await client.admin.setRole({
          userId: original.id,
          role
        })
        if (result.data?.user) {
          refresh()
        } else {
          console.error(result.error)
        }
      }
    }
  })
}

const columns: AdminTableColumn<UserWithRole>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: IDColumn
  },
  {
    accessorKey: 'avatar',
    header: t('user.columns.avatar'),
    cell: avatarColumn
  },
  {
    accessorKey: 'name',
    header: t('global.page.name')
  },
  {
    accessorKey: 'email',
    header: t('user.columns.email')
  },
  {
    accessorKey: 'role',
    header: t('user.columns.role')
  },
  {
    accessorKey: 'status',
    header: t('global.page.status')
  },
  {
    accessorKey: 'createdAt',
    header: t('global.page.createdAt'),
    cell: dateColumn
  },
  {
    id: 'actions',
    cell: ({ row }) => actionColumn(row, getActionItems)
  }
]

const fetchData: FetchDataFn<UserWithRole> = async ({ page, limit }) => {
  const result = await client.admin.listUsers({
    query: {
      limit,
      offset: (page - 1) * limit
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
        icon="i-lucide-plus"
        variant="outline"
        @click="isUserModalOpen = true"
      >
        {{ t('user.actions.createUser') }}
      </UButton>
    </template>
    <AdminTable
      ref="table"
      :columns="columns"
      :fetch-data="fetchData"
    >
      <template #top-Left>
        <UInput
          v-model="search"
          :placeholder="`${t('global.page.name')}...`"
        />
        <CheckboxFilter
          v-model:filter="roleFilter"
          filter-name="role"
          :name="t('user.columns.role')"
          :items="roleOptions"
        />
        <CheckboxFilter
          v-model:filter="statusFilter"
          filter-name="status"
          :name="t('global.page.status')"
          :items="statusOptions"
        />
        <DateRangeFilter
          v-model:date-range="createdAtRange"
          filter-name="createdAt"
          :name="t('global.page.createdAt')"
        />
      </template>
      <template #role-cell="{ row: { original } }">
        <UDropdownMenu
          :items="getRoleDropdownItems(original)"
          arrow
        >
          <UButton
            :color="original.role === 'admin' ? 'primary' : 'neutral'"
            variant="outline"
            size="xs"
            icon="i-lucide-chevron-down"
            trailing
          >
            {{ t(`user.roles.${original.role}`) }}
          </UButton>
        </UDropdownMenu>
      </template>
      <template #status-cell="{ row: { original } }">
        <UBadge
          :color="original.banned
            ? 'error'
            : (original.emailVerified ? 'success' : 'warning')"
          :label="original.banned
            ? t('user.status.banned')
            : (original.emailVerified
              ? t('user.status.verified')
              : t('user.status.unverified'))"
        />
      </template>
    </AdminTable>
    <CreateUserModal
      v-model:open="isUserModalOpen"
      :t="t"
      @created="refresh"
    />
    <BanUserModal
      v-model:open="isBanModalOpen"
      :user-id="selectedUserId"
      :t="t"
      @banned="refresh"
    />
  </NuxtLayout>
</template>
