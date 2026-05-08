import {describe, expect, it} from 'vitest';
import {validateIsString} from './validateIsString';

describe('validateIsString', () => {
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
    [() => undefined, false],
    ['', true],
    ['hello', true],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateIsString().validate(value)).toEqual(expected);
  });
});
