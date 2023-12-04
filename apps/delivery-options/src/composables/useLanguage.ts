import {computed, type Ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useConfigStore} from '../stores';

interface UseLanguage {
  locale: Ref<string>;
  translate(key: string): string;
}

const translate = useMemoize((key: string): string => {
  return key;
});

export const useLanguage = (): UseLanguage => {
  const config = useConfigStore();

  return {
    locale: computed(() => config.locale),
    translate,
  };
};
