import global from './global.json'
import zodEn from './zod/en.json'
import zodFr from './zod/fr.json'
import zodJa from './zod/ja.json'
import zodZhCN from './zod/zh-CN.json'

// Merge zod translations with global messages
const messages = {
  'en': {
    ...zodEn,
    ...global.en
  },
  'zh-CN': {
    ...zodZhCN,
    ...global['zh-CN']
  },
  'ja': {
    ...zodJa,
    ...global.ja
  },
  'fr': {
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
