import {describe, expect, it} from 'vitest';
import {padStart} from './padStart';

describe('padStart', () => {
  it.each([
    [1, 2, '01'],
    [1, 3, '001'],
    [1, 5, '00001'],
    ['3', 2, '03'],
    ['3', 3, '003'],
    ['3', 5, '00003'],
  ])('should pad %s to length %s', (number, length, expected) => {
    expect(padStart(number, length)).toBe(expected);
  });
});
