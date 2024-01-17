import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CLOSED} from '@myparcel-do/shared';
import {createUtcDate} from '../utils';
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

  it('returns a locale formatted distance string', async ({expect}) => {
    expect.assertions(2);
    const i18n = useI18nStore();

    const pickupLocation = usePickupLocation('397882');
    const {distance} = pickupLocation.value ?? {};
    await nextTick();

    expect(distance).toBe('2,5 km');
    i18n.setLocale('en-US');
    expect(distance).toBe('2.5km');
  });

  it('returns a list of opening hours', async ({expect}) => {
    expect.assertions(2);
    const i18n = useI18nStore();
    const now = createUtcDate('2023-12-27');
    vi.setSystemTime(now);

    const pickupLocation = usePickupLocation('217862');
    const {openingHours} = pickupLocation.value ?? {};
    await nextTick();

    i18n.setLocale('nl-NL');

    // Expect to be ordered by closest date
    expect(openingHours).toEqual([
      {weekday: 'vandaag', timeString: '10:00 – 19:00', date: createUtcDate('2023-12-27')},
      {weekday: 'morgen', timeString: '10:00 – 19:00', date: createUtcDate('2023-12-28')},
      {weekday: 'vrijdag', timeString: '10:00 – 18:00', date: createUtcDate('2023-12-29')},
      {weekday: 'zaterdag', timeString: CLOSED, date: createUtcDate('2023-12-30')},
      {weekday: 'zondag', timeString: '10:00 – 19:00', date: createUtcDate('2023-12-31')},
      {weekday: 'maandag', timeString: '10:00 – 19:00', date: createUtcDate('2024-01-01')},
      {weekday: 'dinsdag', timeString: '10:00 – 19:00', date: createUtcDate('2024-01-02')},
    ]);

    i18n.setLocale('en-US');

    expect(openingHours).toEqual([
      {weekday: 'today', timeString: '10:00 AM – 7:00 PM', date: createUtcDate('2023-12-27')},
      {weekday: 'tomorrow', timeString: '10:00 AM – 7:00 PM', date: createUtcDate('2023-12-28')},
      {weekday: 'Friday', timeString: '10:00 AM – 6:00 PM', date: createUtcDate('2023-12-29')},
      {weekday: 'Saturday', timeString: CLOSED, date: createUtcDate('2023-12-30')},
      {weekday: 'Sunday', timeString: '10:00 AM – 7:00 PM', date: createUtcDate('2023-12-31')},
      {weekday: 'Monday', timeString: '10:00 AM – 7:00 PM', date: createUtcDate('2024-01-01')},
      {weekday: 'Tuesday', timeString: '10:00 AM – 7:00 PM', date: createUtcDate('2024-01-02')},
    ]);
  });
});
