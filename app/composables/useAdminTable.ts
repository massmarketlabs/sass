import type { AdminTable } from '#components'

export const useAdminTable = (refName: string = 'table') => {
  const adminTableRef = useTemplateRef<InstanceType<typeof AdminTable>>(refName)
  const getPageInfo = () => {
    if (adminTableRef.value && adminTableRef.value.limit) {
      return {
        page: adminTableRef.value.page,
        limit: adminTableRef.value.limit,
        offset: (adminTableRef.value.page! - 1) * adminTableRef.value.limit!
      }
    } else {
      return {}
    }
  }
  const setPageTotal = (value: number) => {
    if (adminTableRef.value) {
      adminTableRef.value.setPageTotal(value)
    }
  }
  return {
    getPageInfo,
    setPageTotal
  }
}
