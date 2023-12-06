import {computed, reactive, type Ref} from 'vue';
import {get} from 'radash';
import {useLogger} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

interface UseLanguage {
  locale: Ref<string>;

  setStrings(strings: Record<string, string>): void;
  translate(key: string): undefined | string;
}

const state = reactive<{
  strings: Readonly<Record<string, string>>;
}>({
  strings: {},
});

const translate = (key: string): string | undefined => {
  if (Object.keys(state.strings).length === 0) {
    return undefined;
  }

  const translation = get(state.strings, key, undefined);

  if (!translation) {
    const logger = useLogger();
    logger.error(`Missing translation: "${key}"`);
  }

  return translation;
};

export const useLanguage = (): UseLanguage => {
  const config = useConfigStore();

  return {
    locale: computed(() => config.locale),
    translate,

    setStrings(strings: Record<string, string>): void {
      state.strings = Object.freeze(strings);
    },
  };
};
