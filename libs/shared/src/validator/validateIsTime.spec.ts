import {describe, expect, it} from 'vitest';
import {CUTOFF_TIME_SAME_DAY_DEFAULT, CUTOFF_TIME_DEFAULT} from '../data';
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
    ['25:60', false],
    ['00:00', true],
    ['09:01', true],
    ['0:00', true],
    ['13:49', true],
    ['23:59', true],
    ['8:45', true],
    [CUTOFF_TIME_DEFAULT, true],
    [CUTOFF_TIME_SAME_DAY_DEFAULT, true],
  ])(`should validate %s as %s`, (value, expected) => {
    expect(validateIsTime().validate(value)).toEqual(expected);
  });
});
