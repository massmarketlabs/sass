import en from './en'
import fr from './fr'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackWarn: false,
  missingWarn: false,
  messages: {
    fr,
    en
  }
}))
