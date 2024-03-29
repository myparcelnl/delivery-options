import {describe, expect, it} from 'vitest';
import {validateIsCountryCode} from './validateIsCountryCode';

describe('validateIsCountryCode', () => {
  it.each([
    [undefined, false],
    [null, false],
    [true, false],
    [false, false],
    [0, false],
    [1, false],
    [NaN, false],
    [{}, false],
    [[], false],
    [() => {}, false],
    ['', false],
    ['hello', false],
    ['GB', true],
    ['gb', true],
    ['GBR', false],
    ['GBR', false],
    ['GBR', false],
  ])('should validate %s as %s', (value, expected) => {
    // @ts-expect-error - We're testing invalid values on purpose
    expect(validateIsCountryCode().validate(value)).toEqual(expected);
  });
});
