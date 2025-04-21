import type { SQL } from 'drizzle-orm'
import type { PgColumn, PgSelect } from 'drizzle-orm/pg-core'
import { and, asc, desc, eq, getTableColumns, gte, ilike, inArray, lte, sql } from 'drizzle-orm'
import { z } from 'zod'
import * as schema from '~~/server/database/schema'

type TableNames = keyof typeof schema

function isValidTable(table: string): table is TableNames {
  return table in schema
}

function withFilters<T extends PgSelect>(
  qb: T,
  filters: SQL[]
) {
  return qb.where(and(...filters))
}

function withSorts<T extends PgSelect>(
  qb: T,
  sorts: SQL[]
) {
  return qb.orderBy(...sorts)
}

function withPagination<T extends PgSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}

const filterSchema = z.array(
  z.union([
    z.object({
      col: z.string(),
      op: z.literal('between'),
      v: z.tuple([z.string(), z.string()])
    }),
    z.object({
      col: z.string(),
      op: z.literal('in'),
      v: z.array(z.string()).min(1)
    }),
    z.object({
      col: z.string(),
      op: z.literal('like'),
      v: z.string()
    }),
    z.object({
      col: z.string(),
      op: z.literal('eq'),
      v: z.string()
    })
  ])
)

const sortSchema = z.array(
  z.tuple([
    z.string(),
    z.enum(['asc', 'desc'])
  ])
)

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  filter: z.string()
    .transform((str) => {
      try {
        const parsed = JSON.parse(str)
        if (!Array.isArray(parsed))
          return []

        return parsed.reduce<z.infer<typeof filterSchema>>((validFilters, item) => {
          const result = filterSchema.element.safeParse(item)
          if (result.success) {
            validFilters.push(result.data)
          }

          return validFilters
        }, [])
      }
      catch {
        return []
      }
    })
    .optional(),
  sort: z.string()
    .transform((str) => {
      try {
        const parsed = JSON.parse(str)
        if (!Array.isArray(parsed))
          return []

        return parsed.reduce<z.infer<typeof sortSchema>>((validSorts, item) => {
          const result = sortSchema.element.safeParse(item)
          if (result.success) {
            validSorts.push(result.data)
          }
          return validSorts
        }, [])
      }
      catch {
        return []
      }
    })
    .optional()
})

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
      data: 'INVALID_TABLE_NAME',
      message: 'Invalid Table Name'
    })
  }

  const table = schema[tableName]
  const columns = getTableColumns(table)

  const query = await getValidatedQuery(event, querySchema.parse)
  console.log(query)
  const db = await useDB(event)

  const listQuery = db.select().from(table).$dynamic()
  const totalQuery = db.select({ count: sql<number>`cast(count(*) as int)` }).from(table).$dynamic()

  if (query) {
    // Handle filters
    if (query.filter) {
      const filters: SQL[] = []
      for (const filter of query.filter) {
        if (filter.col in columns) {
          const columnKey = filter.col as keyof typeof columns
          const column = table[columnKey] as PgColumn
          if (filter.op === 'between') {
            filters.push(
              and(
                gte(column, new Date(filter.v[0])),
                lte(column, new Date(filter.v[1]))
              )!
            )
          } else if (filter.op === 'in') {
            filters.push(
              inArray(column, filter.v)
            )
          } else if (filter.op == 'like') {
            filters.push(
              ilike(column, `%${filter.v}%`)
            )
          } else if (filter.op == 'eq') {
            filters.push(
              eq(column, filter.v)
            )
          }
        }
      }
      if (filters.length) {
        withFilters(listQuery, filters)
        withFilters(totalQuery, filters)
      }
    }
    // Handle sorting
    if (query.sort?.length) {
      const sorts: SQL[] = []
      for (const [field, direction] of query.sort) {
        if (field in columns) {
          const columnKey = field as keyof typeof columns
          const column = table[columnKey] as PgColumn
          const orderFunc = direction === 'desc' ? desc : asc
          sorts.push(orderFunc(column))
        }
      }
      withSorts(listQuery, sorts)
      withSorts(totalQuery, sorts)
    }
  }

  // Handle pagination
  const page = query?.page || 1
  const limit = query?.limit || 20
  withPagination(listQuery, page, limit)
  console.log(listQuery.toSQL())
  const count = await totalQuery.groupBy(table.id)
  const result = await listQuery

  return {
    data: result,
    total: count[0]?.count || 0,
    page,
    limit
  }
})
