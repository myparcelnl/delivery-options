import {describe, expect, it} from 'vitest';
import {validateIsTime} from './validateIsTime';

describe('validateIsTime', () => {
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
    ['0', false],
    ['1', false],
    ['6', false],
    ['7', false],
    ['0,1,2,5,6', false],
    ['0:0', false],
    ['00:00', true],
    ['09:01', true],
  ])(`should validate %s as %s`, (value, expected) => {
    expect(validateIsTime().validate(value)).toEqual(expected);
  });
});
