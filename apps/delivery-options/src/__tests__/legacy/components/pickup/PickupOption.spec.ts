import {beforeAll, describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import {defaultAddress, getDefaultConfiguration} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

describe.skip('PickupOption.vue', () => {
  let component;

  beforeAll(() => {
    component = mount(PickupOption, {
      localVue: mockVue(getDefaultConfiguration(PlatformName.SendMyParcel)),
      propsData: {
        // Required prop
        data: {
          name: 'test',
          pickupData: {
            carrier: CarrierName.Bpost,
            address: defaultAddress[PlatformName.SendMyParcel],
          },
        },
      },
    });
  });

  it('formats distances correctly', () => {
    const {formatDistance} = component.vm;
    expect(formatDistance(0)).toBe('0m');
    expect(formatDistance(100)).toBe('100m');
    expect(formatDistance(2450)).toBe('2,5km');
    expect(formatDistance(10210)).toBe('10,2km');
  });
});
