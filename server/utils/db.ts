import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { EventHandlerRequest, H3Event } from 'h3'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '../database/schema'
import { getPgPool } from './drivers'

const runtimeConfig = useRuntimeConfig()

// use db without pg pool
const newDB = () => drizzle({ client: getPgPool() })
const db = newDB()

export const getDB = () => {
  if (runtimeConfig.preset == 'node-server') {
    return db
  } else {
    return newDB()
  }
}

// use db with pg pool
export const useDB = async (event?: H3Event<EventHandlerRequest>): Promise<NodePgDatabase<typeof schema>> => {
  // If the event has a context with a db property, return it
  if (event && event.context.db) {
    return event.context.db
  }
  // Otherwise, create a new connection to the database
  // const client = await pgPool.connect()
  const db = drizzle({ client: getPgPool(), schema })
  if (event) {
    event.context.db = db
  }
  return db
}

export type TableNames = keyof typeof schema

export function isValidTable(table: string): table is TableNames {
  return table in schema
}
