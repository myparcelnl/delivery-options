import {useMemoize} from '@vueuse/core';

interface UseLanguage {
  translate(key: string): string;
}

const translate = useMemoize((key: string): string => {
  return key;
});

export const useLanguage = (): UseLanguage => {
  return {
    translate,
  };
};
