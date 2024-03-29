import {describe, expect, it} from 'vitest';
import {validateIsInRange} from './validateIsInRange';

describe('validateIsInRange', () => {
  it.each([
    [-1, false],
    [0, true],
    [5, true],
    [6, false],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateIsInRange(0, 5).validate(value)).toEqual(expected);
  });
});
