import {describe, expect, it} from 'vitest';
import {validateIsInRange} from './validateIsInRange';

describe('validateIsInRange', () => {
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
    [() => {}, false],
    ['', false],
    ['hello', false],
  ])('should validate %s as %s', (value, expected) => {
    // @ts-expect-error - We're testing invalid values on purpose
    expect(validateIsInRange(0, 1).validate(value)).toEqual(expected);
  });
});
