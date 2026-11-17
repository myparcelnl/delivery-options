import {ref} from 'vue';
import {beforeEach, describe, expect, it} from 'vitest';
import {NBSP} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';
import {useLanguage} from './useLanguage';
import {useFormatPrice} from './useFormatPrice';

const PRICE = 4;

const formatWithIntl = (price: number, locale: string, currency: string): string =>
  new Intl.NumberFormat(locale, {style: 'currency', currency}).format(price);

describe('useFormatPrice', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it.each([
    ['nl-NL', 'EUR', `€${NBSP}4,00`],
    ['en-GB', 'EUR', '€4.00'],
  ])('formats a price with locale %s and currency %s as %s', (locale, currency, expected) => {
    useLanguage().setLocale(locale);
    useConfigStore().state.currency = currency;

    expect(useFormatPrice(PRICE).value).toBe(expected);
  });

  it.each([
    ['da-DK', 'DKK'],
    ['pl-PL', 'PLN'],
    ['nl-NL', 'DKK'],
    ['de-DE', 'EUR'],
    ['nl', 'EUR'],
    ['ja-JP', 'JPY'],
    ['nl', 'KWD'],
  ])('formats a price with locale %s and currency %s like Intl does', (locale, currency) => {
    useLanguage().setLocale(locale);
    useConfigStore().state.currency = currency;

    expect(useFormatPrice(PRICE).value).toBe(formatWithIntl(PRICE, locale, currency));
  });

  it('formats a price in euro when the currency is not set', () => {
    useLanguage().setLocale('nl-NL');
    useConfigStore().state.currency = undefined;

    expect(useFormatPrice(PRICE).value).toBe(`€${NBSP}4,00`);
  });

  it('follows changes to the price, the locale and the currency', () => {
    const price = ref(PRICE);
    useLanguage().setLocale('nl-NL');
    useConfigStore().state.currency = 'EUR';

    const formatted = useFormatPrice(price);

    price.value = 5;
    expect(formatted.value).toBe(formatWithIntl(5, 'nl-NL', 'EUR'));

    useLanguage().setLocale('da-DK');
    expect(formatted.value).toBe(formatWithIntl(5, 'da-DK', 'EUR'));

    useConfigStore().state.currency = 'DKK';
    expect(formatted.value).toBe(formatWithIntl(5, 'da-DK', 'DKK'));
  });
});
