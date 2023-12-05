import {describe, expect, it} from 'vitest';
import {validateIsDate} from './validateIsDate';

describe('validateIsDate', () => {
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
    ['2021-01-01', true],
    ['2021-01-01T00:00:00.000Z', true],
    ['2021-01-01T00:00:00.000+00:00', true],
    [new Date(), true],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateIsDate().validate(value)).toEqual(expected);
  });
});
