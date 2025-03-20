<script setup lang="ts">
import { getMenus } from '~/menu'
import SearchPalette from './components/SearchPalette.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

defineShortcuts({
  'g-1': () => router.push('/admin/dashboard'),
  'g-2': () => router.push('/admin/table')
})
const pathNameItemMap: StringDict<NavigationMenuItem> = {}
const pathNameParentMap: StringDict<NavigationMenuItem | undefined> = {}

const menus = getMenus(t)
const menuIterator = (menus: NavigationMenuItem[], parent?: NavigationMenuItem) => {
  for (const menu of menus) {
    const to = `${menu.to}`
    pathNameItemMap[to] = menu!
    pathNameParentMap[to] = parent
    if (menu.to == route.path) {
      if (pathNameParentMap[to]) {
        pathNameParentMap[to].defaultOpen = true
      }
    }
    if (menu.children) {
      menuIterator(menu.children, menu)
    }
  }
}
menus.forEach((group) => {
  menuIterator(group)
})

const clickSignOut = () => {

}
</script>

<template>
  <div>
    <aside class="fixed top-0 left-0 w-64 transition-transform hidden sm:block">
      <div class="h-screen flex flex-col px-3 py-4 bg-gray-100 dark:bg-gray-800">
        <a class="flex items-center ps-2.5 mb-3">
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            {{ t('app.name') }}
          </span>
        </a>
        <div class="flex pl-2 pr-2 mb-2">
          <SearchPalette />
        </div>
        <UNavigationMenu
          :items="menus"
          orientation="vertical"
          class="data-[orientation=vertical]:w-full flex-1 overflow-y-auto"
        />
        <div class="flex flex-col pl-2 pr-2">
          <USeparator />
          <UTooltip
            :ui="{ content: 'w-54 flex flex-col h-auto p-0 gap-0' }"
            :delay-duration="100"
          >
            <template #content>
              <UButton
                icon="i-lucide-rocket"
                size="sm"
                color="neutral"
                variant="link"
                class="w-full p-[10px]"
              >
                Button
              </UButton>
              <USeparator class="w-full" />
              <UButton
                icon="i-lucide-log-out"
                size="sm"
                color="neutral"
                variant="link"
                class="w-full p-[10px]"
                @click="clickSignOut"
              >
                Sign Out
              </UButton>
            </template>
            <div>
              <div class="w-full flex items-center justify-between p-2">
                <div>
                  <UAvatar
                    src="https://avatars.githubusercontent.com/u/64819679?s=48&v=4"
                    size="xs"
                  />
                  <span class="text-xs ml-2">Name</span>
                </div>
                <UIcon name="i-lucide-ellipsis-vertical" />
              </div>
            </div>
          </UTooltip>
        </div>
      </div>
    </aside>
    <div class="p-2 h-screen sm:ml-64 bg-white dark:bg-gray-900">
      <ThreeColumn class="mb-2">
        <template #left>
          <UDrawer
            class="sm:hidden"
            direction="left"
            as="aside"
            :handle="false"
          >
            <UButton
              icon="i-lucide-menu"
              class="w-8 h-8"
              color="neutral"
              variant="ghost"
            />
            <template #content>
              <div class="w-[60vw] p-4">
                <UNavigationMenu
                  orientation="vertical"
                  :items="menus"
                  class="data-[orientation=vertical]:w-full"
                />
              </div>
            </template>
          </UDrawer>
          <ColorModeToggler />
          <title>{{ pathNameItemMap[$route.path]?.label }}</title>
          <h1>{{ pathNameItemMap[$route.path]?.label }} </h1>
          <slot name="navLeft" />
        </template>
        <template #middle>
          <slot name="navMiddle" />
        </template>
        <template #right>
          <slot name="navRight" />
        </template>
      </ThreeColumn>
      <div class="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <!-- <ClientOnly> -->
        <slot />
        <!-- </ClientOnly> -->
      </div>
    </div>
  </div>
</template>
