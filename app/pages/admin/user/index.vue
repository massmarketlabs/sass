<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { t } = useI18n()
const { client } = useAuth()

const isLoading = ref(false)

const columns: TableColumn<UserWithRole>[] = [
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

const { getPageInfo, setPageTotal } = useAdminTable()

const sortBy = ref<SortBy>({ column: 'createdAt', direction: 'desc' })

const fetchData = async () => {
  const result = await client.admin.listUsers({
    query: {
      limit: getPageInfo().limit,
      offset: getPageInfo().offset,
      sortBy: sortBy.value.column,
      sortDirection: sortBy.value.direction
    }
  })
  if (result.data) {
    setPageTotal(result.data.total || result.data.users.length)
    return result.data.users
  } else {
    setPageTotal(0)
    return []
  }
}

const { data, refresh } = await useAsyncData(
  'listUsers',
  () => fetchData()
)
</script>

<template>
  <NuxtLayout name="admin">
    <AdminTable
      ref="table"
      :loading="isLoading"
      :columns="columns"
      :data="data"
      @refresh="refresh"
    />
  </NuxtLayout>
</template>
