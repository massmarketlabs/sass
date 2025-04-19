import type { PgColumn, PgSelect } from 'drizzle-orm/pg-core'
import { and, asc, desc, getTableColumns, gte, inArray, lte, sql } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

type TableNames = keyof typeof schema

function isValidTable(table: string): table is TableNames {
  return table in schema
}

function withPagination<T extends PgSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}
function withInArray<T extends PgSelect>(
  qb: T,
  column: PgColumn,
  values: string[]
) {
  return qb.where(inArray(column, values))
}

function withInDates<T extends PgSelect>(
  qb: T,
  column: PgColumn,
  startDate: Date,
  endDate: Date
) {
  return qb.where(and(
    gte(column, startDate),
    lte(column, endDate)
  ))
}

function withOrder<T extends PgSelect>(
  qb: T,
  orderFunc: typeof asc | typeof desc,
  column: PgColumn
) {
  return qb.orderBy(orderFunc(column))
}

export default eventHandler(async (event) => {
  const tableName = getRouterParam(event, 'tableName')
  if (!tableName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: 'EMPTY_TABLE_NAME',
      message: 'Empty Table Name'
    })
  }

  if (!isValidTable(tableName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: 'INVLIAD_TABLE_NAME',
      message: 'Invalid Table Name'
    })
  }
  const table = schema[tableName]
  const columns = getTableColumns(table)
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20

  const db = await useDB(event)

  const listQuery = db.select().from(table).$dynamic()
  const totalQuery = db.select({ count: sql<number>`cast(count(*) as int)` }).from(table).$dynamic()

  for (const [key, value] of Object.entries(query)) {
    if (['page', 'limit', 'sort'].includes(key))
      continue

    if (key in columns) {
      const columnKey = key as keyof typeof columns
      if (`${columns[columnKey].columnType}` == 'PgTimestamp' && typeof value === 'string') {
        const [start, end] = value.split('|')
        if (start && end) {
          withInDates(listQuery, table[columnKey], new Date(start), new Date(end))
        }
      } else if (typeof value === 'string') {
        const values = value.split(',')
        withInArray(listQuery, table[columnKey], values)
        withInArray(totalQuery, table[columnKey], values)
      }
    }
  }

  // Handle sorting
  if (query.sort && typeof query.sort === 'string') {
    const sortParams = query.sort.split(',')
    for (const param of sortParams) {
      const [field, direction] = param.split(':')
      if (field in columns) {
        const columnKey = field as keyof typeof columns
        const orderFunc = direction === 'desc'
          ? desc
          : asc
        withOrder(listQuery, orderFunc, table[columnKey])
        withOrder(totalQuery, orderFunc, table[columnKey])
      }
    }
  }

  // Handle pagination
  withPagination(listQuery, page, limit)
  const count = await totalQuery.groupBy(table.id)
  const result = await listQuery

  return {
    data: result,
    total: count[0].count,
    page,
    limit
  }
})
