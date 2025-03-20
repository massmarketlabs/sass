<script setup lang="ts">
const colorMode = useColorMode()
const { t } = useI18n()
const router = useRouter()

const groups = ref([
  {
    id: 'Routes',
    label: 'Routes',
    items: [
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/admin/dashboard',
        kbds: [
          'G',
          '1'
        ]
      },
      {
        label: 'Table',
        icon: 'i-lucide-file-text',
        to: '/admin/table',
        kbds: [
          'G',
          '2'
        ]
      }
    ]
  },
  {
    id: 'theme',
    label: 'Theme',
    items: [{
      id: 'theme-light',
      label: 'Light',
      disabled: colorMode.preference === 'light',
      click: () => {
        colorMode.preference = 'light'
      }
    }, {
      id: 'theme-dark',
      label: 'Dark',
      disabled: colorMode.preference === 'dark',
      click: () => {
        colorMode.preference = 'dark'
      }
    }]
  }
])

const value = ref({})
const isOpen = ref(false)

defineShortcuts({
  shift_g: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    }
  },
  escape: {
    usingInput: true,
    handler: () => { isOpen.value = false }
  }
})

const onClosePalette = (value: boolean) => {
  if (!value) {
    isOpen.value = false
  }
}

function onSelectPalette(item: any) {
  if (item.onSelect) {
    item.onSelect()
  } else if (item.to) {
    if (typeof item.to === 'string' && (item.target === '_blank' || item.to.startsWith('http'))) {
      window.open(item.to, item.target || '_blank')
    } else {
      router.push(item.to)
    }
  }
  onClosePalette(false)
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <UButton
      class="w-full"
      size="sm"
      icon="i-lucide-search"
      color="neutral"
      variant="outline"
      @click="isOpen = true"
    >
      <span class="w-full text-left">{{ `${t('search')}...` }}</span>
      <template #trailing>
        <UKbd value="shift" />
        <UKbd value="G" />
      </template>
    </UButton>
    <template #content>
      <UCommandPalette
        v-model="value"
        close
        :groups="groups"
        class="flex-1"
        @update:open="onClosePalette"
        @update:model-value="onSelectPalette"
      />
    </template>
  </UModal>
</template>
