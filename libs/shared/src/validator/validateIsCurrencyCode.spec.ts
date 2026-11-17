import {afterEach, describe, expect, it, vi} from 'vitest';
import {validateIsCurrencyCode} from './validateIsCurrencyCode';

const VERY_LONG_TEXT = 'A'.repeat(10_000);

describe('validateIsCurrencyCode', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    [undefined, false],
    [null, false],
    [true, false],
    [0, false],
    [123, false],
    [NaN, false],
    [{}, false],
    [[], false],
    [() => undefined, false],
    ['', false],
    ['123', false],
    ['D1', false],
    ['ABC', false],
    ['EURO', false],
    [VERY_LONG_TEXT, false],
    ['EUR', true],
    ['DKK', true],
    ['PLN', true],
    ['dkk', true],
  ])('validates %s as %s', (value, expected) => {
    expect(validateIsCurrencyCode().validate(value)).toBe(expected);
  });

  it('parses a currency code to upper case', () => {
    expect(validateIsCurrencyCode().parse?.('dkk')).toBe('DKK');
  });

  it('rejects every currency when the browser cannot list the supported currencies', () => {
    vi.stubGlobal('Intl', {...Intl, supportedValuesOf: undefined});

    expect(validateIsCurrencyCode().validate('DKK')).toBe(false);
  });
});
