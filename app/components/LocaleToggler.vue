<script setup lang="ts">
const { locale, setLocale, locales } = useI18n()

const localeItems = computed(() => {
  return locales.value.map(item => ({
    label: getLocaleName(item.code),
    type: 'checkbox' as const,
    checked: locale.value === item.code,
    onUpdateChecked: async (checked: boolean) => {
      if (checked) {
        await setLocale(item.code)
      }
    }
  }))
})

function getLocaleName(code: string) {
  const names = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    fr: 'Français'
  }
  return names[code as keyof typeof names] || code
}
</script>

<template>
  <UDropdownMenu :items="localeItems">
    <UButton
      icon="i-lucide-languages"
      color="neutral"
      variant="ghost"
      class="w-8 h-8"
    />
  </UDropdownMenu>
</template>
