import {capitalize, computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {isString} from 'radash';
import {addDays, isBefore, differenceInCalendarDays, startOfDay} from 'date-fns';
import {type DateLike, normalizeDate, useMemoize} from '@vueuse/core';
import {stringToDate} from '../utils';
import {useLanguage} from './useLanguage';

const FORMAT_LONG = 'long';
const FORMAT_NUMERIC = 'numeric';
const FORMAT_AUTO = 'auto';

interface FormattedDateInstance {
  date: ComputedRef<Date>;
  day: ComputedRef<string>;
  month: ComputedRef<string>;
  relative: ComputedRef<string>;
  relativeWeekday: ComputedRef<string>;
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
    const diff = differenceInCalendarDays(startOfDay(date), startOfDay(new Date()));

    return intl.format(diff, 'day');
  };
});

const createDateFormatter: CreateDateFormatter = useMemoize((locale, options): DateFormatterFunction => {
  const formatter = new Intl.DateTimeFormat(locale, options);

  return (date) => formatter.format(date);
});

// eslint-disable-next-line max-lines-per-function
export const useDateFormat = (date: MaybeRef<DateLike>): FormattedDateInstance => {
  const {locale} = useLanguage();

  const resolvedDate = computed(() => {
    const resolvedDate = toValue(date);

    return isString(resolvedDate) ? stringToDate(resolvedDate) : normalizeDate(resolvedDate);
  });

  const relative = computed(() => {
    const format = createRelativeDateFormatter(toValue(locale));

    return format(resolvedDate.value);
  });

  const weekday = computed(() => {
    const format = createDateFormatter(toValue(locale), {weekday: FORMAT_LONG});

    return capitalize(format(resolvedDate.value));
  });

  const relativeWeekday = computed(() => {
    const format = createDateFormatter(toValue(locale), {weekday: FORMAT_LONG});

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (isBefore(resolvedDate.value, addDays(Date.now(), 2))) {
      return capitalize(relative.value);
    }

    return capitalize(format(resolvedDate.value));
  });

  const day = computed(() => {
    const format = createDateFormatter(toValue(locale), {day: FORMAT_NUMERIC});

    return format(resolvedDate.value);
  });

  const time = computed(() => {
    const format = createDateFormatter(toValue(locale), {
      hour: FORMAT_NUMERIC,
      minute: FORMAT_NUMERIC,
    });

    return format(resolvedDate.value);
  });

  const standard = computed(() => {
    const format = createDateFormatter(toValue(locale), {
      weekday: FORMAT_LONG,
      day: FORMAT_NUMERIC,
      month: FORMAT_LONG,
    });

    return format(resolvedDate.value);
  });

  const month = computed(() => {
    const format = createDateFormatter(toValue(locale), {month: FORMAT_LONG});

    return format(resolvedDate.value);
  });

  return {
    date: resolvedDate,
    day,
    month,
    relative,
    standard,
    time,
    weekday,
    relativeWeekday,
  };
};
