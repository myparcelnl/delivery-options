import {computed, reactive, type Ref} from 'vue';
import {get} from 'radash';
import {useLogger} from '@myparcel-do/shared';
import {useI18nStore} from '../stores';

interface UseLanguage {
  locale: Ref<string>;

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

export const useLanguage = (): UseLanguage => {
  const i18n = useI18nStore();

  return {
    locale: computed(() => i18n.locale),
    translate,

    setStrings(strings: Record<string, string>): void {
      state.strings = Object.freeze(strings);
    },
  };
};
