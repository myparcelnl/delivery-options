import {describe, expect, it} from 'vitest';
import {toTime} from './toTime';

describe('toTime', () => {
  it('should convert date to time', () => {
    expect(toTime(new Date('2020-01-01T12:00:00'))).toBe('12:00');
  });

  it('should convert string to time', () => {
    expect(toTime('2020-01-01T12:00:00')).toBe('12:00');
  });
});
