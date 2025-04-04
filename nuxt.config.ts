// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    'nuxt-echarts'
  ],
  i18n: {
    vueI18n: '~/i18n/i18n.config.ts',
    baseUrl: process.env.BETTER_AUTH_URL,
    locales: ['en', 'zh', 'ja', 'fr'].map((lang) => {
      return {
        code: lang,
        language: lang
      }
    }),
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
        redirectUserTo: '/dashboard',
        redirectGuestTo: '/login'
      }
    }
  }
})
