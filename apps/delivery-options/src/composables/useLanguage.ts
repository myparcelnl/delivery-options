import {computed, type ComputedRef, reactive} from 'vue';
import {get} from 'radash';
import {useMemoize} from '@vueuse/core';
import {useLogger} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

interface UseLanguage {
  locale: ComputedRef<string>;

  setLocale(locale: string): void;
  setStrings(strings: Record<string, string>): void;
  translate(key: string): string;
}

const state = reactive<{
  strings: Readonly<Record<string, string>>;
}>({
  strings: {},
});

const translate = (key: string): string => {
  if (Object.keys(state.strings).length === 0) {
    return key;
  }

  const translation = get(state.strings, key, key);

  if (!translation) {
    const logger = useLogger();
    logger.error(`Missing translation: "${key}"`);
  }

  return translation;
};

export const useLanguage = useMemoize((): UseLanguage => {
  const config = useConfigStore();

  return {
    locale: computed(() => config.locale),

    setLocale(locale: string): void {
      config.locale = locale;
    },

    translate,

    setStrings(strings: Record<string, string>): void {
      state.strings = Object.freeze(strings);
    },
  } as UseLanguage;
});
