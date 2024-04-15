import {type ComputedRef} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {
  KEY_CONFIG,
  ConfigSetting,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  DELIVERY_TYPE_DEFAULT,
  PACKAGE_TYPE_DEFAULT,
  type SupportedPackageTypeName,
  type SelectOption,
} from '@myparcel-do/shared';
import {CarrierName, PackageTypeName} from '@myparcel/constants';
import {parseJson} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {mockSelectedDeliveryOptions, mockDeliveryOptionsConfig} from '../__tests__';
import {useDeliveryMomentOptions} from './useDeliveryMomentOptions';

const setup = async (packageType?: SupportedPackageTypeName): Promise<ComputedRef<SelectOption<string>[]>> => {
  mockDeliveryOptionsConfig({
    [KEY_CONFIG]: {
      [ConfigSetting.ShowDeliveryDate]: true,
      [CarrierSetting.AllowDeliveryOptions]: true,
      [CarrierSetting.AllowStandardDelivery]: true,
      [CarrierSetting.AllowEveningDelivery]: true,
      [CarrierSetting.AllowMorningDelivery]: true,
      [CarrierSetting.AllowSignature]: true,
      [CarrierSetting.AllowOnlyRecipient]: true,
      [KEY_CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {},
        [CarrierName.DhlForYou]: {},
      },
      // TODO: allow optional key to be passed with undefined as value
      ...(packageType ? {[CarrierSetting.PackageType]: packageType} : {}),
    },
  });
  mockSelectedDeliveryOptions();

  const options = useDeliveryMomentOptions();
  await flushPromises();

  return options;
};

describe('useDeliveryMomentOptions', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns delivery moment options', async () => {
    expect.assertions(8);
    const options = await setup();

    expect(options.value).toHaveLength(1);

    options.value.forEach((option) => {
      expect(Object.keys(option)).toEqual(['carrier', 'label', 'price', 'value']);
      expect(option.value).toBeTypeOf('string');

      const parsedValue = parseJson<SelectedDeliveryMoment>(option.value);

      expect(parsedValue.carrier).toBe(CarrierName.PostNl);
      expect(parsedValue.time).not.toBeNull();
      expect(parsedValue.deliveryType).toBe(DELIVERY_TYPE_DEFAULT);
      expect(parsedValue.packageType).toBe(PACKAGE_TYPE_DEFAULT);
      expect(parsedValue.shipmentOptions).toEqual([]);
    });
  });

  it.each([PackageTypeName.Mailbox, PackageTypeName.DigitalStamp, PackageTypeName.PackageSmall])(
    'returns delivery moment options for different package types',
    async (packageType) => {
      expect.assertions(8);

      const options = await setup(packageType);

      expect(options.value).toHaveLength(1);

      options.value.forEach((option) => {
        expect(Object.keys(option)).toEqual(['carrier', 'label', 'price', 'value']);
        expect(option.value).toBeTypeOf('string');

        const parsedValue = parseJson<SelectedDeliveryMoment>(option.value);

        expect(parsedValue.carrier).toBe(CarrierName.PostNl);
        expect(parsedValue.time).toBeNull();
        expect(parsedValue.deliveryType).toBe(DELIVERY_TYPE_DEFAULT);
        expect(parsedValue.packageType).toBe(packageType);
        expect(parsedValue.shipmentOptions).toEqual([]);
      });
    },
  );
});
