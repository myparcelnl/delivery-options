import {describe, expect, it} from 'vitest';
import {validateIsValue} from './validateIsValue';

describe('validateIsValue', () => {
  it.each([
    [undefined, [1, 2, 3], false],
    [null, [1, 2, 3], false],
    [true, [1, 2, 3], false],
    [false, [1, 2, 3], false],
    [{}, [1, 2, 3], false],
    [[], [1, 2, 3], false],
    [() => undefined, [1, 2, 3], false],
    ['', [1, 2, 3], false],
    ['hello', [1, 2, 3], false],
    [0, [1, 2, 3], false],
    [1, [1, 2, 3], true],
    ['v', ['a', 'b', 'c'], false],
    ['a', ['a', 'b', 'c'], true],
  ] as [unknown, unknown[], boolean][])('should validate %s as %s', (value, values, expected) => {
    expect(validateIsValue(values).validate(value)).toEqual(expected);
  });
});
