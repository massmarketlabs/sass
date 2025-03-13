export default defineEventHandler(async (event) => {
  const start = Date.now()
  const { req, res } = event.node

  await res.on('finish', () => {
    // Release db connection
    if (event.context.db) {
      event.context.db.$client.release()
    }

    const duration = Date.now() - start
    const statusCode = res.statusCode
    const method = req.method
    const url = req.url

    // Access Log
    console.log(`[${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms`)
  })
})
