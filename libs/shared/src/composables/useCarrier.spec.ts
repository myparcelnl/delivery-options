import {describe, it, expect, beforeEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {useCarrier} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

describe('useCarrier', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('sets small package pickup countries', () => {
    const carrierIdentifier = CarrierName.PostNl;
    const platformName = PlatformName.MyParcel;
    const carrier = useCarrier({carrierIdentifier, platformName});

    expect(carrier.smallPackagePickupCountries.value).toEqual(new Set(['NL', 'BE']));
  });
});
