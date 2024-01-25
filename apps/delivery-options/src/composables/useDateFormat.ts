import {capitalize, computed, type MaybeRef, reactive, type UnwrapNestedRefs} from 'vue';
import {isString} from 'radash';
import {addDays, isBefore} from 'date-fns';
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
  day: ComputedRef<string>;
  month: ComputedRef<string>;
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

// eslint-disable-next-line max-lines-per-function
export const useDateFormat = (date: MaybeRef<DateLike>): UnwrapNestedRefs<FormattedDateInstance> => {
  const {locale} = useLanguage();

  const resolvedDate = computed(() => {
    const resolvedDate = get(date);

    return isString(resolvedDate) ? stringToDate(resolvedDate) : normalizeDate(resolvedDate);
  });

  const relative = computed(() => {
    const format = createRelativeDateFormatter(get(locale));

    return format(resolvedDate.value);
  });

  const weekday = computed(() => {
    const format = createDateFormatter(get(locale), {weekday: FORMAT_LONG});

    if (isBefore(resolvedDate.value, addDays(Date.now(), 2))) {
      return capitalize(relative.value);
    }

    return format(resolvedDate.value);
  });

  const day = computed(() => {
    const format = createDateFormatter(get(locale), {day: FORMAT_NUMERIC});

    return format(resolvedDate.value);
  });

  const time = computed(() => {
    const format = createDateFormatter(get(locale), {
      hour: FORMAT_NUMERIC,
      minute: FORMAT_NUMERIC,
    });

    return format(resolvedDate.value);
  });

  const standard = computed(() => {
    const format = createDateFormatter(get(locale), {
      weekday: FORMAT_LONG,
      day: FORMAT_NUMERIC,
      month: FORMAT_LONG,
    });

    return format(resolvedDate.value);
  });

  const month = computed(() => {
    const format = createDateFormatter(get(locale), {month: FORMAT_LONG});

    return format(resolvedDate.value);
  });

  return reactive({
    date: resolvedDate,
    day,
    month,
    relative,
    standard,
    time,
    weekday,
  });
};
