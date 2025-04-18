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

export async function getDBStats() {
  const basicStats = getPoolStats()
  const db = await pgPool.connect()
  const dbStatsResult = await db.query(`
    SELECT
      numbackends as active_backends,
      xact_commit as commits,
      xact_rollback as rollbacks,
      blks_read,
      blks_hit,
      tup_returned,
      tup_fetched,
      tup_inserted,
      tup_updated,
      tup_deleted,
      conflicts,
      temp_files,
      temp_bytes,
      deadlocks
    FROM pg_stat_database
    WHERE datname = current_database()
  `)
  db.release()
  const dbStats = dbStatsResult.rows[0]
  const cacheHitRatio = dbStats.blks_hit / (dbStats.blks_read + dbStats.blks_hit) * 100

  return {
    pool: basicStats,
    activeBackends: Number(dbStats.active_backends),
    transactions: {
      commits: Number(dbStats.commits),
      rollbacks: Number(dbStats.rollbacks)
    },
    tuples: {
      returned: Number(dbStats.tup_returned),
      fetched: Number(dbStats.tup_fetched),
      inserted: Number(dbStats.tup_inserted),
      updated: Number(dbStats.tup_updated),
      deleted: Number(dbStats.tup_deleted)
    },
    cacheHitRatio: Math.round(cacheHitRatio * 100) / 100,
    conflicts: Number(dbStats.conflicts),
    deadlocks: Number(dbStats.deadlocks),
    tempFiles: {
      count: Number(dbStats.temp_files),
      bytes: Number(dbStats.temp_bytes)
    }
  }
}
