import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {normalizeDate} from '@vueuse/core';
import {CLOSED} from '@myparcel-do/shared';
import {useI18nStore} from '../stores';
import {getFakePickupLocation, mockDeliveryOptionsConfig} from '../__tests__';
import {usePickupLocation} from './usePickupLocation';

describe.concurrent('usePickupLocation', (it) => {
  beforeEach(() => {
    setActivePinia(createPinia());

    mockDeliveryOptionsConfig();
    usePickupLocation.clear();
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns a locale formatted distance string', async ({expect}) => {
    expect.assertions(2);
    const i18n = useI18nStore();

    const {distance} = usePickupLocation(JSON.stringify(getFakePickupLocation('397882')));
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

    const {openingHours} = usePickupLocation(JSON.stringify(getFakePickupLocation('217862')));
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
});
