<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { t } = useI18n()
const { client } = useAuth()

const isLoading = ref(false)

const columns: TableColumn<any, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (cell: any) => IDColumn(cell)
  },
  {
    accessorKey: 'avatar',
    header: t('columns.avatar'),
    cell: (cell: any) => avatarColumn(cell)
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
    header: t('columns.role')
    // cell: (row: any) => h(UBadge, {
    //   color: row.role === 'admin' ? 'primary' : 'secondary',
    //   label: row.role
    // })
  },
  {
    accessorKey: 'status',
    header: t('columns.status')
    // cell: (row: any) => h(UBadge, {
    //   color: row.banned ? 'error' : (row.emailVerified ? 'success' : 'warning'),
    //   label: row.banned ? t('status.banned') : (row.emailVerified ? t('status.verified') : t('status.unverified'))
    // })
  },
  {
    accessorKey: 'createdAt',
    header: t('columns.createdAt'),
    cell: (row: any) => new Date(row.createdAt).toLocaleDateString()
  }
]

const { getPageInfo, setPageTotal } = useAdminTable()

const sortBy = ref<SortBy>({ column: 'createdAt', direction: 'desc' })

const listUsers = async () => {
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
  () => listUsers()
)
</script>

<template>
  <NuxtLayout name="admin">
    <AdminTable
      ref="table"
      :loading="isLoading"
      :columns="columns"
      :data="data"
      @fetch-data="refresh"
    />
  </NuxtLayout>
</template>
