<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import type { Subscription } from '@better-auth/stripe'

const { t } = useI18n()
const { client } = useAuth()

const filters: AdminTableFilter[] = reactive([
  {
    name: t('global.page.status'),
    field: 'status',
    type: 'tabs',
    items: [
      { label: t('global.page.all'), id: 'all' },
      { label: t('subscription.status.active'), id: 'active' },
      { label: t('subscription.status.trialing'), id: 'trialing' },
      { label: t('subscription.status.incomplete'), id: 'incomplete' },
      { label: t('subscription.status.incomplete_expired'), id: 'incomplete_expired' },
      { label: t('subscription.status.paused'), id: 'paused' },
      { label: t('subscription.status.canceled'), id: 'canceled' },
      { label: t('subscription.status.pastDue'), id: 'past_due' },
      { label: t('subscription.status.unpaid'), id: 'unpaid' }
    ],
    value: '',
    clearValue: 'all'
  }
])

const { refresh } = useAdminTable()

const getActionItems = (row: Row<Subscription>) => {
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
      label: t('global.page.cancel'),
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

const columns: AdminTableColumn<Subscription>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'stripeCustomerId',
    header: t('subscription.stripeCustomerId')
  },
  {
    accessorKey: 'plan',
    header: t('subscription.plan')
  },
  {
    accessorKey: 'status',
    header: t('global.page.status')
  },
  {
    accessorKey: 'period',
    header: t('subscription.period')
  },
  {
    accessorKey: 'seats',
    header: t('subscription.seats')
  },
  // {
  //   accessorKey: 'createdAt',
  //   header: t('global.page.createdAt'),
  //   cell: dateColumn
  // },
  {
    id: 'actions',
    cell: ({ row }) => actionColumn(row, getActionItems)
  }
]

const fetchData: FetchDataFn<Subscription> = async ({ page, limit, sort, filter }) => {
  const result = await $fetch<PageData<Subscription>>('/api/admin/list/subscription', {
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
    data: result.data,
    total: result.total
  }
}

const getStatusColor = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  switch (status) {
    case 'active':
      return 'success'
    case 'trialing':
      return 'info'
    case 'paused':
    case 'incomplete':
    case 'incomplete_expired':
      return 'warning'
    case 'canceled':
    case 'past_due':
    case 'unpaid':
      return 'error'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <NuxtLayout name="admin">
    <AdminTable
      ref="table"
      :columns="columns"
      :filters="filters"
      :fetch-data="fetchData"
    >
      <template #status-cell="{ row: { original } }">
        <UBadge
          :color="getStatusColor(original.status)"
          :label="t(`subscription.status.${original.status.replace('_', '')}`)"
        />
      </template>
      <template #period-cell="{ row: { original } }">
        <span v-if="original.periodStart && original.periodEnd">
          {{ formatToDay(original.periodStart) }} ~ {{ formatToDay(original.periodEnd) }}
        </span>
      </template>
    </AdminTable>
  </NuxtLayout>
</template>
