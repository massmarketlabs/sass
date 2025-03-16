// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint'
  ],
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
  future: {
    compatibilityVersion: 4
  },
  runtimeConfig: {
    public: {
      auth: {
        redirectUserTo: '/dashboard',
        redirectGuestTo: '/login'
      }
    }
  },
  imports: {
    imports: [
      {
        from: 'zod',
        name: 'z'
      }
    ]
  }
})
