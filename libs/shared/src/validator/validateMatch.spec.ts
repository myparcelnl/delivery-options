import {describe, expect, it} from 'vitest';
import {validateMatch} from './validateMatch';

describe('validateMatch', () => {
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
    ['hello', true],
    ['hello123', false],
    ['he', false],
    ['hellooooo', true],
    ['hello1234', false],
  ])('should validate %s as %s', (value, expected) => {
    expect(validateMatch(/^[a-z]{5,10}$/).validate(value)).toEqual(expected);
  });
});
