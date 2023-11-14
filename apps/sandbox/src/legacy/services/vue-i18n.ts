import {englishTranslations} from '../translations/en';

Vue.use(VueI18n);

/**
 * Create an i18n instance.
 *
 * @returns {VueI18n}
 */
export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: englishTranslations,
  },
});
