import { defu } from 'defu'

type MiddlewareOptions = false | {
  /**
   * Only apply auth middleware to guest or user
   */
  only?: 'guest' | 'user'
  /**
   * Redirect authenticated user to this route
   */
  authenticatedRedirect?: string
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
  const { loggedIn, options, fetchSession } = useAuth()
  const { only, authenticatedRedirect, unauthenticatedRedirect } = defu(to.meta?.auth, options)

  // If guest mode, redirect if authenticated
  if (only === 'guest' && loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === authenticatedRedirect) {
      return
    }
    return navigateTo(`${unauthenticatedRedirect}?redirect=${to.fullPath}`)
  }

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
})
