import {describe, expect, it} from 'vitest';
import {validateDropOffDays} from './validateDropOffDays';

describe('validateDropOffDays', () => {
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
    ['0', true],
    ['1', true],
    ['6', true],
    ['7', false],
    ['0,1,2,5,6', true],
    ['0;1;2;3;4;5;6', true],
    ['0,1,2,3,4,5,6,7', false],
    ['0;1;2;3;4;5;6;7', false],
    ['0,1,2,3,4,5,6,7,8', false],
    ['0;1;2;3;4;5;6;7;8', false],
    ['0,1,2,3,4,5,6,7,8,9', false],
    ['0;1;2;3;4;5;6;7;8;9', false],
  ])('should validate %s as %s', (value, expected) => {
    // @ts-expect-error - We're testing invalid values on purpose
    expect(validateDropOffDays().validate(value)).toEqual(expected);
  });
});
