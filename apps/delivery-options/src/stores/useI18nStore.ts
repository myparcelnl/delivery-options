import {defineStore} from 'pinia';
import {useNavigatorLanguage} from '@vueuse/core';
import {useConfigStore} from './useConfigStore';

export const useI18nStore = defineStore('i18n', {
  state: () => {
    const config = useConfigStore();
    const lang = useNavigatorLanguage();

    console.log(config.locale ?? lang.language.value);

    return {
      locale: config.locale ?? lang.language.value,
      currency: config.currency ?? 'EUR',
    };
  },

  actions: {
    setLocale(locale: string) {
      this.locale = locale;
    },
  },
});
