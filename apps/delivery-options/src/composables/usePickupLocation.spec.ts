import {afterEach, beforeEach, describe, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {CLOSED} from '@myparcel-do/shared';
import {createUtcDate} from '../utils';
import {mockDeliveryOptionsConfig, waitForPickupLocations} from '../__tests__';
import {useLanguage} from './useLanguage';
import {getFullPickupLocation, usePickupLocation} from './fullPickupLocation';

describe.concurrent.skip('usePickupLocation', (it) => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    mockDeliveryOptionsConfig();

    const {setLocale} = useLanguage();
    setLocale('nl-NL');

    await waitForPickupLocations();
  });

  afterEach(() => {
    getFullPickupLocation.clear();
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns a locale formatted distance string', async ({expect}) => {
    expect.assertions(2);
    const {setLocale} = useLanguage();

    const pickupLocation = usePickupLocation('397882');
    await flushPromises();

    const {distance} = pickupLocation.value ?? {};

    expect(distance).toBe('2,5 km');

    setLocale('en-US');
    expect(distance).toBe('2.5km');
  });

  it('returns a list of opening hours', async ({expect}) => {
    expect.assertions(2);
    const {setLocale} = useLanguage();
    const now = createUtcDate('2023-12-27');
    vi.setSystemTime(now);

    const pickupLocation = usePickupLocation('217862');
    await flushPromises();

    const {openingHours} = pickupLocation;

    // Expect to be ordered by closest date
    expect(openingHours.value).toEqual([
      {weekday: 'vandaag', timeString: '10:00 – 19:00', date: createUtcDate('2023-12-27')},
      {weekday: 'morgen', timeString: '10:00 – 19:00', date: createUtcDate('2023-12-28')},
      {weekday: 'vrijdag', timeString: '10:00 – 18:00', date: createUtcDate('2023-12-29')},
      {weekday: 'zaterdag', timeString: CLOSED, date: createUtcDate('2023-12-30')},
      {weekday: 'zondag', timeString: '10:00 – 19:00', date: createUtcDate('2023-12-31')},
      {weekday: 'maandag', timeString: '10:00 – 19:00', date: createUtcDate('2024-01-01')},
      {weekday: 'dinsdag', timeString: '10:00 – 19:00', date: createUtcDate('2024-01-02')},
    ]);

    setLocale('en-US');

    expect(openingHours.value).toEqual([
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
