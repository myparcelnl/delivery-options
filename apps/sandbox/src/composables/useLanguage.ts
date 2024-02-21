import {computed, reactive, type Ref, ref} from 'vue';
import {camel} from 'radash';
import {useLocalStorage, useMemoize, usePreferredLanguages} from '@vueuse/core';
import {
  type DeliveryOptionsStrings,
  resolveTranslatable,
  type AnyTranslatable,
  isTranslatable,
} from '@myparcel-do/shared';
import {type LanguageDefinition} from '../types';
import {AVAILABLE_LANGUAGES} from '../constants';

export type TranslationsObject = Record<string, string>;

interface UseLanguage {
  availableLanguages: LanguageDefinition[];
  language: Ref<LanguageDefinition>;
  loading: Ref<boolean>;
  strings: Ref<DeliveryOptionsStrings>;

  has(translatable: AnyTranslatable): boolean;

  load(): Promise<void>;

  setLanguage(languageCode: string): Promise<void>;

  translate(translatable: AnyTranslatable): string;
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
  (translatable: AnyTranslatable): string => {
    const resolvedKey = resolveTranslatable(translatable);

    if (!isTranslatable(translatable)) {
      return resolvedKey;
    }

    const result = state.translations[language.value.code]?.[resolvedKey];

    if (!result) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Missing translation:', resolvedKey);
      }

      return resolvedKey;
    }

    const matches = result.match(/@:([^" ]+)/g);

    if (matches) {
      return matches.reduce((acc, match) => {
        return acc.replace(match, translate(match.substring(2)));
      }, result);
    }

    return result;
  },
  {
    getKey: (translatable) => {
      return `${language.value.code}_${JSON.stringify(translatable)}`;
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

    has(translatable: undefined | AnyTranslatable): boolean {
      if (!translatable) {
        return false;
      }

      const resolvedKey = resolveTranslatable(translatable);

      return !!state.translations[language.value.code]?.[resolvedKey];
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
