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
    header: 'ID'
  },
  {
    accessorKey: 'image',
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

const fetchData: FetchDataFn<UserWithRole> = async ({ page, limit, sort }) => {
  const filter = []
  if (search.value) {
    filter.push({
      col: 'name',
      op: 'like',
      v: search.value
    })
  }
  if (roleFilter.value.length) {
    filter.push({
      col: 'role',
      op: 'in',
      v: roleFilter.value
    })
  }
  const { start, end } = createdAtRange.value
  if (start && end) {
    filter.push({
      col: 'createdAt',
      op: 'between',
      v: [formatToDate(start).toISOString(), formatToDate(end).toISOString()]
    })
  }

  const result = await $fetch('/api/admin/list/user', {
    query: {
      page,
      limit,
      sort: JSON.stringify(sort.map((item) => {
        return [item.field, item.order]
      })),
      filter: JSON.stringify(filter)
    }
  })
  return {
    data: result.data as unknown as UserWithRole[],
    total: result.total
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
