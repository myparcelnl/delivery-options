import {type ComputedRef} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  type SupportedPackageTypeName,
  type SelectOption,
  KEY_CONFIG,
  CarrierSetting,
  ConfigSetting,
  KEY_CARRIER_SETTINGS,
} from '@myparcel-dev/do-shared';
import {CarrierName, PackageTypeName} from '@myparcel-dev/constants';
import {parseJson} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useConfigStore} from '../stores';
import {mockSelectedDeliveryOptions, mockDeliveryOptionsConfig, waitForDeliveryOptions} from '../__tests__';
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
      [CarrierSetting.PriceStandardDelivery]: 3,
      [KEY_CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [CarrierSetting.PricePackageTypePackageSmall]: 6,
        },
        [`${CarrierName.PostNl}:123`]: {
          [CarrierSetting.PriceStandardDelivery]: 456,
          [CarrierSetting.PricePackageTypeMailbox]: 5,
          [CarrierSetting.PricePackageTypeDigitalStamp]: 4,
        },
        [CarrierName.DhlForYou]: {},
      },
      // TODO: allow optional key to be passed with undefined as value
      ...(packageType ? {[CarrierSetting.PackageType]: packageType} : {}),
    },
  });
  mockSelectedDeliveryOptions();

  const options = useDeliveryMomentOptions();
  await waitForDeliveryOptions();
  await flushPromises();

  return options;
};

describe('useDeliveryMomentOptions', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it.each([
    PackageTypeName.Package,
    PackageTypeName.Mailbox,
    PackageTypeName.DigitalStamp,
    PackageTypeName.PackageSmall,
  ])('returns delivery moment options with package type %s', async (packageType) => {
    expect.assertions(2);

    const options = await setup(packageType);

    expect(options.value).toHaveLength(2);

    const resolved = options.value.map((option) => ({
      ...option,
      value: parseJson<SelectedDeliveryMoment>(option.value),
    }));

    expect(resolved).toMatchSnapshot();
  });
});
