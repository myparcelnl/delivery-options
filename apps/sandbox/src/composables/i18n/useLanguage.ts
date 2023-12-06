import {computed, reactive, type Ref, ref, watch} from 'vue';
import {useLocalStorage, useMemoize, usePreferredLanguages} from '@vueuse/core';
import {type LanguageDefinition} from '../../types';
import {AVAILABLE_LANGUAGES} from '../../constants';

export type TranslationsObject = Record<string, string>;

interface UseLanguage {
  availableLanguages: LanguageDefinition[];
  language: Ref<LanguageDefinition>;
  translations: Ref<TranslationsObject>;

  setLanguage(languageCode: string): void;

  translate(key: string): string;
}

const language = useLocalStorage('language', ref<LanguageDefinition>(), {
  serializer: {
    read: JSON.parse,
    write: JSON.stringify,
  },
});

const state = reactive<{
  initialized: boolean;
  translations: Record<string, TranslationsObject>;
}>({
  initialized: false,
  translations: {},
});

const loadLanguage = useMemoize(async (language: LanguageDefinition): Promise<TranslationsObject> => {
  const [resultA, resultB] = await Promise.all([
    fetch(`/translations/${language.code}.json`),
    fetch(`/translations/delivery-options/${language.code}.json`),
  ]);

  if (!resultA.ok || !resultB.ok) {
    return loadLanguage(AVAILABLE_LANGUAGES[0]);
  }

  return {...(await resultA.json()), ...(await resultB.json())};
});

const translate = useMemoize(
  (key: string): string => {
    return state.translations[language.value.code]?.[key] ?? key;
  },
  {
    getKey: (key) => {
      return key + language.value.code;
    },
  },
);

const initializeLanguage = (): void => {
  if (!language.value) {
    const preferredLanguages = usePreferredLanguages();
    const supportedLanguage = AVAILABLE_LANGUAGES.find((language) => preferredLanguages.value.includes(language.code));

    language.value = supportedLanguage ?? AVAILABLE_LANGUAGES[0];
  }

  watch(
    language,
    async (language) => {
      state.translations[language.code] = await loadLanguage(language);
    },
    {immediate: true},
  );
};

export const useLanguage = (): UseLanguage => {
  if (!state.initialized) {
    state.initialized = true;

    initializeLanguage();
  }

  return {
    translate,
    language,
    availableLanguages: AVAILABLE_LANGUAGES,
    translations: computed(() => state.translations[language.value.code] ?? {}),
    setLanguage(languageCode: string) {
      const supportedLanguage = AVAILABLE_LANGUAGES.find((language) => language.code === languageCode);

      if (supportedLanguage) {
        language.value = supportedLanguage;
      }
    },
  };
};
