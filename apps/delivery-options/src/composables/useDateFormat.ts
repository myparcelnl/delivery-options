import {computed, type MaybeRef} from 'vue';
import {isString} from 'radash';
import {type DateLike, get, normalizeDate, useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {stringToDate} from '../utils';
import {useLanguage} from './useLanguage';

const SECONDS_IN_DAY = 86400000;

const FORMAT_LONG = 'long';
const FORMAT_NUMERIC = 'numeric';
const FORMAT_AUTO = 'auto';

interface FormattedDateInstance {
  date: ComputedRef<Date>;
  relative: ComputedRef<string>;
  standard: ComputedRef<string>;
  time: ComputedRef<string>;
  weekday: ComputedRef<string>;
}

type DateFormatterFunction = (date: Date) => string;

type CreateDateFormatter = (locale: string, options?: Intl.DateTimeFormatOptions) => DateFormatterFunction;

export const createRelativeDateFormatter: CreateDateFormatter = useMemoize((locale): DateFormatterFunction => {
  const intl = new Intl.RelativeTimeFormat(locale, {
    numeric: FORMAT_AUTO,
    style: FORMAT_LONG,
  });

  return (date) => {
    const diff = (date.getTime() - Date.now()) / SECONDS_IN_DAY;

    return intl.format(Math.round(diff), 'day');
  };
});

const createDateFormatter: CreateDateFormatter = useMemoize((locale, options): DateFormatterFunction => {
  const formatter = new Intl.DateTimeFormat(locale, options);

  return (date) => formatter.format(date);
});

export const useDateFormat = (date: MaybeRef<DateLike>): FormattedDateInstance => {
  const {locale} = useLanguage();

  const resolvedDate = computed(() => {
    const resolvedDate = get(date);

    return isString(resolvedDate) ? stringToDate(resolvedDate) : normalizeDate(resolvedDate);
  });

  return {
    date: resolvedDate,

    relative: computed(() => {
      const formatter = createRelativeDateFormatter(get(locale));

      return formatter(resolvedDate.value);
    }),

    standard: computed(() => {
      const formatter = createDateFormatter(get(locale), {
        weekday: FORMAT_LONG,
        day: FORMAT_NUMERIC,
        month: FORMAT_LONG,
      });

      return formatter(resolvedDate.value);
    }),

    time: computed(() => {
      const formatter = createDateFormatter(get(locale), {
        hour: FORMAT_NUMERIC,
        minute: FORMAT_NUMERIC,
      });

      return formatter(resolvedDate.value);
    }),

    weekday: computed(() => {
      const formatter = createDateFormatter(get(locale), {
        weekday: FORMAT_LONG,
      });

      return formatter(resolvedDate.value);
    }),
  };
};
