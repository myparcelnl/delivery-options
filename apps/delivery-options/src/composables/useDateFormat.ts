import {computed, type MaybeRef} from 'vue';
import {type DateLike, get, normalizeDate, useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {useLanguage} from './useLanguage';

const SECONDS_IN_DAY = 86400000;

interface FormattedDateInstance {
  default: ComputedRef<string>;
  relative: ComputedRef<string>;
}

type DateFormatterFunction = (date: DateLike) => string;

type CreateDateFormatter = (locale: string, options?: Intl.DateTimeFormatOptions) => DateFormatterFunction;

export const createRelativeDateFormatter: CreateDateFormatter = useMemoize((locale): DateFormatterFunction => {
  const intl = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'long',
  });

  return (date: DateLike): string => {
    const resolvedDate = normalizeDate(date);
    const offset = Math.floor((resolvedDate.getTime() - Date.now()) / SECONDS_IN_DAY);

    return intl.format(offset, 'day');
  };
});

const createDefaultDateFormatter: CreateDateFormatter = useMemoize((locale): DateFormatterFunction => {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (date: DateLike) => formatter.format(normalizeDate(date));
});

export const useDateFormat = (date: MaybeRef<DateLike>): FormattedDateInstance => {
  const {locale} = useLanguage();

  const resolvedDate = computed(() => normalizeDate(get(date)));

  return {
    relative: computed(() => {
      const formatter = createRelativeDateFormatter(get(locale));

      return formatter(resolvedDate.value);
    }),

    default: computed(() => {
      const formatter = createDefaultDateFormatter(get(locale));

      return formatter(resolvedDate.value);
    }),
  };
};
