import global from './global.json'
import zodEn from './zod/en.json'
import zodFr from './zod/fr.json'
import zodJa from './zod/ja.json'
import zodZh from './zod/zh.json'

// Merge zod translations with global messages
const messages = {
  en: {
    ...zodEn,
    ...global.en
  },
  zh: {
    ...zodZh,
    ...global.zh
  },
  ja: {
    ...zodJa,
    ...global.ja
  },
  fr: {
    ...zodFr,
    ...global.fr
  }
}

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackWarn: false,
  missingWarn: false,
  messages
}))
