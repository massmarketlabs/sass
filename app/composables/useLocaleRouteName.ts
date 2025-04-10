export function useLocaleRouteName() {
  const route = useRoute()
  const routeParts = (route.name as string).split('___')
  const routeName = routeParts[0]
  return {
    routeName
  }
}
