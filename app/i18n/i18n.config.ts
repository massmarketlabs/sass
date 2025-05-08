import global from './global.json'
import zodAr from './zod/ar.json'
import zodEn from './zod/en.json'

// Merge zod translations with global messages
const messages = {
  en: {
    ...zodEn,
    ...global.en
  },
  ar: {
    zodAr,
    ...global.ar
  }
}

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackWarn: false,
  missingWarn: false,
  messages
}))
