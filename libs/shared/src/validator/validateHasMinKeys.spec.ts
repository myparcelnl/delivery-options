import {describe, expect, it} from 'vitest';
import {validateHasMinKeys} from './validateHasMinKeys';

describe('validateHasMinKeys', () => {
  it.each([
    [{}, 0, true],
    [{}, 1, false],
    [{a: 1}, 0, true],
    [{a: 1}, 1, true],
    [{a: 1}, 2, false],
    [{a: 1, b: 2}, 0, true],
    [{a: 1, b: 2}, 1, true],
    [{a: 1, b: 2}, 2, true],
    [{a: 1, b: 2}, 3, false],
  ])('should validate %s as %s', (value, keys, expected) => {
    expect(validateHasMinKeys(keys).validate(value)).toEqual(expected);
  });
});
