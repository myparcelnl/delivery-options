import {describe, expect, it} from 'vitest';
import {validateIsBoolean} from './validateIsBoolean';

describe('validateIsBoolean', () => {
  it.each([
    [undefined, false],
    [null, false],
    [true, true],
    [false, true],
    [0, false],
    [1, false],
    [NaN, false],
    [{}, false],
    [[], false],
    [() => undefined, false],
    ['', false],
    ['hello', false],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateIsBoolean().validate(value)).toEqual(expected);
  });
});
