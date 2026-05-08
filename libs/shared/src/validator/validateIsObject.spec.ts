import {describe, expect, it} from 'vitest';
import {validateIsObject} from './validateIsObject';

describe('validateIsObject', () => {
  it.each([
    [undefined, false],
    [null, false],
    [true, false],
    [false, false],
    [0, false],
    [1, false],
    [NaN, false],
    [{}, true],
    [[], false],
    [() => undefined, false],
    ['', false],
    ['hello', false],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateIsObject().validate(value)).toEqual(expected);
  });
});
