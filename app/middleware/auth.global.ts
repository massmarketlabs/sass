import { defu } from 'defu'

type MiddlewareOptions = false | {
  /**
   * Redirect guest to this route
   */
  unauthenticatedRedirect?: string
}

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, user, options, fetchSession } = useAuth()
  const { unauthenticatedRedirect } = defu(to.meta?.auth, options)

  // If client-side, fetch session between each navigation
  if (import.meta.client) {
    await fetchSession()
  }
  // If not authenticated, redirect to home
  if (!loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === unauthenticatedRedirect) {
      return
    }
    return navigateTo(`${unauthenticatedRedirect}?redirect=${to.fullPath}`)
  }
  const routeParts = (to.name as string).split('___')
  const routeName = routeParts[0]
  const localePath = useLocalePath()
  if (routeName?.startsWith('admin') && user.value?.role != 'admin') {
    return navigateTo(localePath('/403'))
  }
  if (routeName == 'admin') {
    return navigateTo(localePath('/admin/dashboard'))
  }
})
