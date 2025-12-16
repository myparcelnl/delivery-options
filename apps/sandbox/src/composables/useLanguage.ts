import {computed, reactive, type Ref} from 'vue';
import {camel} from 'radash';
import {useLocalStorage, useMemoize, usePreferredLanguages} from '@vueuse/core';
import {
  type DeliveryOptionsStrings,
  resolveTranslatable,
  type AnyTranslatable,
  isTranslatable,
} from '@myparcel-dev/do-shared';
import {createAssetUrl} from '../utils/createAssetUrl';
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

const getInitialLanguage = (): string => {
  const preferredLanguages = usePreferredLanguages();
  const supportedLanguage = [...AVAILABLE_LANGUAGES]
    .sort((languageA, languageB) => {
      return preferredLanguages.value.indexOf(languageA.code) - preferredLanguages.value.indexOf(languageB.code);
    })
    .find((language) => preferredLanguages.value.includes(language.code));

  return (supportedLanguage ?? AVAILABLE_LANGUAGES[0]).code;
};

const language = useLocalStorage('language', getInitialLanguage);

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
    fetch(createAssetUrl(`translations/${language.code}.json`)),
    fetch(createAssetUrl(`translations/delivery-options/${language.code}.json`)),
  ]);

  return {...(await resultA.json()), ...(await resultB.json())};
});

const translate = useMemoize(
  (translatable: AnyTranslatable): string => {
    const resolvedKey = resolveTranslatable(translatable);

    if (!isTranslatable(translatable)) {
      return resolvedKey;
    }

    const result = state.translations[language.value]?.[resolvedKey];

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
      return `${language.value}_${JSON.stringify(translatable)}`;
    },
  },
);

const initializeLanguage = async (): Promise<void> => {
  await setLanguage(language.value);

  state.initialized = true;
};

const setLanguage = async (languageCode: string) => {
  state.loading = true;

  const supportedLanguage = AVAILABLE_LANGUAGES.find((language) => language.code === languageCode);

  if (!supportedLanguage) {
    return;
  }

  state.translations[supportedLanguage.code] = await loadLanguage(supportedLanguage);

  language.value = supportedLanguage.code;

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

      return !!state.translations[language.value]?.[resolvedKey];
    },

    setLanguage,

    language: computed(() => {
      return AVAILABLE_LANGUAGES.find((lang) => lang.code === language.value) ?? AVAILABLE_LANGUAGES[0];
    }),
    loading: computed(() => state.loading),
    availableLanguages: AVAILABLE_LANGUAGES,
    strings: computed(() => {
      const translations = state.translations[language.value] ?? {};

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
