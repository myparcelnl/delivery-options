import {createI18n} from 'vue-i18n';
import {englishTranslations} from '@/translations/en';

/**
 * Create an i18n instance.
 */
export const i18n = createI18n<[typeof englishTranslations], 'en'>({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: englishTranslations,
  },
});
