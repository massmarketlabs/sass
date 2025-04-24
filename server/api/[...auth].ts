import { auth, newAuth } from '~~/server/utils/auth'

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig()
  if (runtimeConfig.preset == 'node-server') {
    return auth.handler(toWebRequest(event))
  } else {
    return newAuth().handler(toWebRequest(event))
  }
})
