import {computed, reactive, type Ref, ref} from 'vue';
import {useLocalStorage, useMemoize, usePreferredLanguages} from '@vueuse/core';
import {type LanguageDefinition} from '../types';
import {AVAILABLE_LANGUAGES} from '../constants';
import type {DeliveryOptionsStrings} from '@myparcel-do/shared';

export type TranslationsObject = Record<string, string>;

interface UseLanguage {
  availableLanguages: LanguageDefinition[];
  language: Ref<LanguageDefinition>;
  loading: Ref<boolean>;
  strings: Ref<DeliveryOptionsStrings>;

  setLanguage(languageCode: string): Promise<void>;
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
  loading: boolean;
}>({
  initialized: false,
  translations: {},
  loading: false,
});

const loadLanguage = useMemoize(async (language: LanguageDefinition): Promise<TranslationsObject> => {
  const [resultA, resultB] = await Promise.all([
    fetch(`/translations/${language.code}.json`),
    fetch(`/translations/delivery-options/${language.code}.json`),
  ]);

  return {...(await resultA.json()), ...(await resultB.json())};
});

const translate = useMemoize((key: string): string => state.translations[language.value.code]?.[key] ?? key, {
  getKey: (key) => {
    return `${language.value.code}_${key}`;
  },
});

const initializeLanguage = async (): Promise<void> => {
  if (!language.value) {
    const preferredLanguages = usePreferredLanguages();

    const supportedLanguage = [...AVAILABLE_LANGUAGES]
      .sort((a, b) => preferredLanguages.value.indexOf(a.code) - preferredLanguages.value.indexOf(b.code))
      .find((language) => preferredLanguages.value.includes(language.code));

    language.value = supportedLanguage ?? AVAILABLE_LANGUAGES[0];
  }

  await setLanguage(language.value.code);
};

const setLanguage = async (languageCode: string) => {
  state.loading = true;

  const supportedLanguage = AVAILABLE_LANGUAGES.find((language) => language.code === languageCode);

  if (!supportedLanguage) {
    return;
  }

  state.translations[supportedLanguage.code] = await loadLanguage(supportedLanguage);

  language.value = supportedLanguage;

  state.loading = false;
};

export const useLanguage = (): UseLanguage => {
  if (!state.initialized) {
    state.initialized = true;

    void initializeLanguage();
  }

  return {
    translate,
    setLanguage,

    language,
    loading: computed(() => state.loading),
    availableLanguages: AVAILABLE_LANGUAGES,
    strings: computed(() => {
      const translations = state.translations[language.value.code] ?? {};
      const regExp = /^string_([A-z]+)$/;

      return Object.fromEntries(
        Object.entries(translations).reduce((acc, [key, value]) => {
          if (regExp.exec(key)?.[1]) {
            const trimmedKey = key.replace(regExp, '$1');

            acc.push([trimmedKey, value]);
          }

          return acc;
        }, [] as [string, string][]),
      );
    }),
  };
};
