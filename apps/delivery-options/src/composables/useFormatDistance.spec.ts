import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {useLanguage} from './useLanguage';
import {useFormatDistance} from './useFormatDistance';

describe('useFormatDistance', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    [0, '0 m'],
    [0.1, '0 m'],
    [1, '1 m'],
    [100, '100 m'],
    [999, '999 m'],
    [999.9999, '1 km'],
    [1000, '1 km'],
    [1500, '1,5 km'],
    [2456, '2,5 km'],
    [9999, '10 km'],
    [10000, '10 km'],
    [1489001, '1.489 km'],
  ])(`formats %i to %s`, (distance, expected) => {
    const formatted = useFormatDistance(distance);

    expect(formatted.value).toBe(expected);
  });

  it.concurrent('reacts to locale changes', ({expect}) => {
    const {setLocale} = useLanguage();

    const formatted = useFormatDistance(2456);

    setLocale('nl-NL');
    expect(formatted.value).toBe('2,5 km');
    setLocale('en-US');
    expect(formatted.value).toBe('2.5km');
  });
});
