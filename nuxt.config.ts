// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    'nuxt-zod-i18n', // before @nuxtjs/i18n module
    '@nuxtjs/i18n',
    'nuxt-echarts'
  ],
  components: [
    { path: '~/components/filters', pathPrefix: false },
    '~/components'
  ],
  i18n: {
    vueI18n: '~/i18n/i18n.config.ts',
    baseUrl: process.env.BETTER_AUTH_URL,
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文' },
      { code: 'ja', iso: 'ja-JP', name: '日本語' },
      { code: 'fr', iso: 'fr-FR', name: 'Français' }
    ],
    defaultLocale: 'en',
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  eslint: {
    config: {
      standalone: false
    }
  },
  fonts: {
    provider: 'local'
  },
  icon: {
    clientBundle: {
      scan: {
        globInclude: ['**\/*.{vue,jsx,tsx,md,mdc,mdx}', 'app/**/*.ts']
      }
    }
  },
  echarts: {
    charts: ['LineChart', 'PieChart'],
    components: ['GridComponent', 'TooltipComponent', 'TitleComponent', 'LegendComponent']
  },
  future: {
    compatibilityVersion: 4
  },
  hooks: {
    'pages:extend': function (pages) {
      const pagesToRemove: NuxtPage[] = []
      pages.forEach((page) => {
        if (page.path.includes('component') || page.path.includes('/api')) {
          pagesToRemove.push(page)
        }
      })

      pagesToRemove.forEach((page: NuxtPage) => {
        pages.splice(pages.indexOf(page), 1)
      })
      // Uncomment to show current Routes
      // console.log(`\nCurrent Routes:`)
      // console.log(pages)
      // console.log(`\n`)
    }
  },
  runtimeConfig: {
    public: {
      auth: {
        unauthenticatedRedirect: '/signin'
      }
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicons/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicons/site.webmanifest' }
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'NuxSaaS' }
      ]
    }
  }
})
