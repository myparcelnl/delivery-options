import {computed, reactive, type Ref, ref} from 'vue';
import {camel} from 'radash';
import {useLocalStorage, useMemoize, usePreferredLanguages} from '@vueuse/core';
import {type DeliveryOptionsStrings} from '@myparcel-do/shared';
import {type LanguageDefinition} from '../types';
import {AVAILABLE_LANGUAGES} from '../constants';

export type TranslationsObject = Record<string, string>;

interface UseLanguage {
  availableLanguages: LanguageDefinition[];
  language: Ref<LanguageDefinition>;
  loading: Ref<boolean>;
  strings: Ref<DeliveryOptionsStrings>;

  has(key: string): boolean;

  load(): Promise<void>;

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

const translate = useMemoize(
  (key: string): string => {
    const result = state.translations[language.value.code]?.[key];

    if (!result) {
      return key;
    }

    const matches = result.match(/@:([^"]+)/g);

    if (matches) {
      return matches.reduce((acc, match) => {
        return acc.replace(match, translate(match.substring(2)));
      }, result);
    }

    return result;
  },
  {
    getKey: (key) => {
      return `${language.value.code}_${key}`;
    },
  },
);

const initializeLanguage = async (): Promise<void> => {
  const preferredLanguages = usePreferredLanguages();
  const supportedLanguage = [...AVAILABLE_LANGUAGES]
    .sort((a, b) => preferredLanguages.value.indexOf(a.code) - preferredLanguages.value.indexOf(b.code))
    .find((language) => preferredLanguages.value.includes(language.code));

  language.value = supportedLanguage ?? AVAILABLE_LANGUAGES[0];

  await setLanguage(language.value.code);

  state.initialized = true;
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

const TRANSLATION_PREFIX = 'd_o_';

export const useLanguage = (): UseLanguage => {
  const load = async (): Promise<void> => {
    if (state.initialized) {
      return;
    }

    return initializeLanguage();
  };

  void load();

  return {
    load,
    translate,

    has(key: string): boolean {
      return !!state.translations[language.value.code]?.[key];
    },

    setLanguage,

    language,
    loading: computed(() => state.loading),
    availableLanguages: AVAILABLE_LANGUAGES,
    strings: computed(() => {
      const translations = state.translations[language.value.code] ?? {};

      return Object.fromEntries(
        Object.entries(translations)
          .filter(([key]) => key.startsWith(TRANSLATION_PREFIX))
          .map(([key, value]) => {
            const newKey = camel(key.replace(TRANSLATION_PREFIX, ''));

            return [newKey, value];
          }),
      );
    }),
  };
};
