import {describe, expect, it} from 'vitest';
import {validateIsNumeric} from './validateIsNumeric';

describe('validateIsNumeric', () => {
  it.each([
    [undefined, false],
    [null, false],
    [true, false],
    [false, false],
    [0, true],
    [1, true],
    [NaN, false],
    [{}, false],
    [[], false],
    [() => undefined, false],
    ['', false],
    ['hello', false],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateIsNumeric().validate(value)).toEqual(expected);
  });
});
