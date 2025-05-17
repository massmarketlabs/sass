// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema'
import * as nuxtLocales from '@nuxt/ui/locale'
import { generateRunimeTimeConfig } from './server/utils/runtimeConfig'

const locales = [
  nuxtLocales.en,
  nuxtLocales.ar
]
const adminExcludes = locales
  .filter(locale => locale.code !== 'en')
  .map(locale => `/${locale.code}/admin/**`)

export default defineNuxtConfig({
  compatibilityDate: '2025-04-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    'nuxt-zod-i18n', // before @nuxtjs/i18n module
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-charts',
    '@nuxt/test-utils/module',
    'reka-ui/nuxt',
    ...(process.env.NUXT_NITRO_PRESET !== 'node-server' ? ['@nuxthub/core'] : [])
  ],
  ...(process.env.NUXT_NITRO_PRESET !== 'node-server'
    ? {
        hub: {
          workers: true,
          kv: true,
          bindings: {
            hyperdrive: {
              HYPERDRIVE: process.env.NUXT_CF_HYPERDRIVE_ID as string
            }
          }
        }
      }
    : {}),
  i18n: {
    vueI18n: '~/i18n/i18n.config.ts',
    baseUrl: process.env.NUXT_APP_URL,
    locales,
    defaultLocale: 'en',
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  sitemap: {
    exclude: [
      '/admin/**',
      ...adminExcludes
    ]
  },
  robots: {
    disallow: [
      '/admin',
      ...adminExcludes.map(path => path.replace('/**', ''))
    ]
  },
  eslint: {
    config: {
      standalone: false
    }
  },
  fonts: {
    provider: 'local'
  },
  ogImage: {
    enabled: false
  },
  icon: {
    serverBundle: false,
    clientBundle: {
      scan: {
        globInclude: ['**\/*.{vue,jsx,tsx,md,mdc,mdx}', 'app/**/*.ts']
      }
    }
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
  runtimeConfig: generateRunimeTimeConfig(),
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicons/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicons/site.webmanifest' }
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: process.env.NUXT_APP_NAME }
      ]
    }
  },
  nitro: {
    preset: process.env.NUXT_NITRO_PRESET,
    rollupConfig: {
      external: process.env.NUXT_NITRO_PRESET != 'node-server' ? ['pg-native'] : undefined
    }
  }
})
