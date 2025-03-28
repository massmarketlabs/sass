import { pgPool } from './drivers'

// Track pool stats
let activeConnections = 0
const showConnectLog = false

pgPool.on('connect', () => {
  if (showConnectLog) {
    console.log(`[PG Pool] New client connected. Total: ${pgPool.totalCount}`)
  }
})

pgPool.on('error', (err) => {
  console.error('[PG Pool] Unexpected error on idle client', err)
})

pgPool.on('acquire', () => {
  activeConnections++
  if (showConnectLog) {
    console.log(`[PG Pool] Connection acquired. Active connections: ${activeConnections}/${pgPool.totalCount}`)
  }
})

pgPool.on('release', (err) => {
  activeConnections--
  if (err) {
    console.error('[PG Pool] Error when releasing client', err)
  }
  if (showConnectLog) {
    console.log(`[PG Pool] Connection released. Active connections: ${activeConnections}/${pgPool.totalCount}`)
  }
})

pgPool.on('remove', () => {
  if (showConnectLog) {
    console.log(`[PG Pool] Client removed. Total: ${pgPool.totalCount}`)
  }
})

export function getPoolStats() {
  return {
    totalCount: pgPool.totalCount,
    idleCount: pgPool.idleCount,
    waitingCount: pgPool.waitingCount,
    activeConnections
  }
}
