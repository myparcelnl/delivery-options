import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {normalizeDate} from '@vueuse/core';
import {CLOSED} from '@myparcel-do/shared';
import {useI18nStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {usePickupLocation} from './usePickupLocation';

describe.concurrent('usePickupLocation', (it) => {
  beforeEach(() => {
    setActivePinia(createPinia());

    mockDeliveryOptionsConfig();
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns undefined if location cannot be found', async ({expect}) => {
    expect.assertions(1);
    const {location} = usePickupLocation('123');
    await nextTick();

    expect(location.value).toBeUndefined();
  });

  it('returns a formatted address string', async ({expect}) => {
    expect.assertions(1);
    const {address} = usePickupLocation('397882');
    await nextTick();

    expect(address.value).toBe('Daalmeerstraat 15, HOOFDDORP');
  });

  it('returns a locale formatted distance string', async ({expect}) => {
    expect.assertions(2);
    const i18n = useI18nStore();

    const {distance} = usePickupLocation('397882');
    await nextTick();

    expect(distance.value).toBe('2,5 km');
    i18n.setLocale('en-US');
    expect(distance.value).toBe('2.5km');
  });

  it('returns a list of opening hours', async ({expect}) => {
    expect.assertions(2);
    const i18n = useI18nStore();
    const now = normalizeDate('2023-12-27');
    vi.setSystemTime(now);

    const {openingHours} = usePickupLocation('217862');
    await nextTick();

    // Expect to be ordered by closest date
    expect(openingHours.value).toEqual([
      {weekday: 'vandaag', timeString: '10:00 – 19:00', date: normalizeDate('2023-12-27')},
      {weekday: 'donderdag', timeString: '10:00 – 19:00', date: normalizeDate('2023-12-28')},
      {weekday: 'vrijdag', timeString: '10:00 – 18:00', date: normalizeDate('2023-12-29')},
      {weekday: 'zaterdag', timeString: CLOSED, date: normalizeDate('2023-12-30')},
      {weekday: 'zondag', timeString: '10:00 – 19:00', date: normalizeDate('2023-12-31')},
      {weekday: 'maandag', timeString: '10:00 – 19:00', date: normalizeDate('2024-01-01')},
      {weekday: 'dinsdag', timeString: '10:00 – 19:00', date: normalizeDate('2024-01-02')},
    ]);

    i18n.setLocale('en-US');

    expect(openingHours.value).toEqual([
      {weekday: 'today', timeString: '10:00 AM – 7:00 PM', date: normalizeDate('2023-12-27')},
      {weekday: 'Thursday', timeString: '10:00 AM – 7:00 PM', date: normalizeDate('2023-12-28')},
      {weekday: 'Friday', timeString: '10:00 AM – 6:00 PM', date: normalizeDate('2023-12-29')},
      {weekday: 'Saturday', timeString: CLOSED, date: normalizeDate('2023-12-30')},
      {weekday: 'Sunday', timeString: '10:00 AM – 7:00 PM', date: normalizeDate('2023-12-31')},
      {weekday: 'Monday', timeString: '10:00 AM – 7:00 PM', date: normalizeDate('2024-01-01')},
      {weekday: 'Tuesday', timeString: '10:00 AM – 7:00 PM', date: normalizeDate('2024-01-02')},
    ]);
  });

  it('returns whether location is a parcel locker', async ({expect}) => {
    expect.assertions(2);
    const {isLocker: isNotLocker} = usePickupLocation('397882');
    const {isLocker} = usePickupLocation('261534');
    await nextTick();

    expect(isNotLocker.value).toBe(false);
    expect(isLocker.value).toBe(true);
  });
});
