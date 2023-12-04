import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {useNow} from '@vueuse/core';
import {useI18nStore} from '../stores';
import {useDateFormat} from './useDateFormat';

describe('useDateFormat', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    ['nl-NL', 'vandaag'],
    ['en-GB', 'today'],
  ])('should return a relative date for %s', (locale, result) => {
    const i18n = useI18nStore();

    i18n.setLocale(locale);

    const date = useNow();
    const actualNow = date.value.setTime(date.value.getTime() + 1000);

    const {relative} = useDateFormat(actualNow);

    expect(relative.value).toBe(result);
  });

  it.each([
    ['nl-NL', 'dinsdag 25 mei'],
    ['en-GB', 'Tuesday, 25 May'],
  ])(`should return a default date for %s`, (locale, result) => {
    const i18n = useI18nStore();

    i18n.setLocale(locale);

    const date = new Date('2021-05-25');
    const {default: defaultDate} = useDateFormat(date);

    expect(defaultDate.value).toBe(result);
  });
});
