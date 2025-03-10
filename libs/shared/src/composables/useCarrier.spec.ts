import {describe, it, expect} from 'vitest';
import {useCarrier} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

describe('useCarrier', () => {
  it('sets small package pickup countries', () => {
    const carrierIdentifier = CarrierName.PostNl;
    const platformName = PlatformName.MyParcel;
    const carrier = useCarrier({carrierIdentifier, platformName});

    expect(carrier.smallPackagePickupCountries.value).toEqual(new Set(['NL', 'BE']));
  });
});
