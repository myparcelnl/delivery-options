import {computed, type ComputedRef, reactive} from 'vue';
import {get} from 'radash';
import {useMemoize, isDef} from '@vueuse/core';
import {
  useLogger,
  type AnyTranslatable,
  resolveTranslatable,
  isTranslatable,
  type TranslatableWithArgs,
} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import {useConfigStore} from '../stores';

interface UseLanguage {
  locale: ComputedRef<string>;

  setLocale(locale: string): void;
  setStrings(strings: Record<string, string>): void;
  translate(translatable: AnyTranslatable): string;
}

const state = reactive<{
  strings: Readonly<Record<string, string>>;
}>({
  strings: {},
});

const translate = useMemoize((translatable: AnyTranslatable): string => {
  const resolvedKey = resolveTranslatable(translatable);

  if (Object.keys(state.strings).length === 0 || !isTranslatable(translatable)) {
    return resolvedKey;
  }

  const translation = get<string | undefined>(state.strings, resolvedKey);

  if (!isDef(translation)) {
    const logger = useLogger();

    if (import.meta.env.DEV) logger.error(`Missing translation: "${resolvedKey}"`);

    return resolvedKey;
  }

  const replacers = translation.match(/\{(.+?)}/g);

  if (replacers?.length && isOfType<TranslatableWithArgs>(translatable, 'args')) {
    replacers.reverse();

    return replacers.reduce((string, match) => {
      const argKey = match.slice(1, -1);
      const matchingArg = translatable?.args?.[argKey];

      if (!matchingArg) {
        return string;
      }

      return string.replace(match, translate(matchingArg));
    }, translation);
  }

  return translation;
});

export const useLanguage = useMemoize((): UseLanguage => {
  const {state: config} = useConfigStore();

  return {
    locale: computed(() => config.locale),

    setLocale(locale: string): void {
      config.locale = locale;
    },

    translate,

    setStrings(strings: Record<string, string>): void {
      state.strings = Object.freeze({...strings});
    },
  } as UseLanguage;
});
