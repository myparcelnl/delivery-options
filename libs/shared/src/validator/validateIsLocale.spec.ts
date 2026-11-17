import {describe, expect, it} from 'vitest';
import {validateIsLocale} from './validateIsLocale';

describe('validateIsLocale', () => {
  it.each([
    [undefined, false],
    [null, false],
    [true, false],
    [0, false],
    [123, false],
    [{}, false],
    [[], false],
    [() => undefined, false],
    ['', false],
    ['nl_NL', false],
    ['pt-PT-ao90', false],
    ['nl-NL', true],
    ['nl', true],
    ['nl-NL-formal', true],
    ['da-DK', true],
  ])('validates %s as %s', (value, expected) => {
    expect(validateIsLocale().validate(value)).toBe(expected);
  });
});
