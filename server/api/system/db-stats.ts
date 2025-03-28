import { getPoolStats } from '~~/server/utils/dbStats'

export default defineEventHandler(async () => {
  return getPoolStats()
})
