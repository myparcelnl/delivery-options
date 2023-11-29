import {type Ref, ref} from 'vue';
import {useLocalStorage, useMemoize, usePreferredLanguages} from '@vueuse/core';
import {type LanguageDefinition} from '../types';
import {AVAILABLE_LANGUAGES} from '../constants';

interface UseLanguage {
  availableLanguages: LanguageDefinition[];
  language: Ref<LanguageDefinition>;

  setLanguage(languageCode: string): void;

  translate(key: string): string;
}

const language = useLocalStorage('language', ref<LanguageDefinition>(), {
  serializer: {
    read: JSON.parse,
    write: JSON.stringify,
  },
});

const translate = useMemoize((key: string): string => {
  return key;
});

export const useLanguage = (): UseLanguage => {
  if (!language.value) {
    const preferredLanguages = usePreferredLanguages();
    const supportedLanguage = AVAILABLE_LANGUAGES.find((language) => preferredLanguages.value.includes(language.code));

    language.value = supportedLanguage ?? AVAILABLE_LANGUAGES[0];
  }

  return {
    translate,
    language,
    availableLanguages: AVAILABLE_LANGUAGES,
    setLanguage(languageCode: string) {
      const supportedLanguage = AVAILABLE_LANGUAGES.find((language) => language.code === languageCode);

      if (supportedLanguage) {
        language.value = supportedLanguage;
      }
    },
  };
};
