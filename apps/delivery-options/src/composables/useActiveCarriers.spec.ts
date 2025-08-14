import {toValue} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  type CarrierIdentifier,
  KEY_CONFIG,
  ConfigSetting,
  type SupportedPlatformName,
  useCarriersRequest,
  resolveCarrierName,
  waitForRequestData,
  KEY_ADDRESS,
  AddressField,
} from '@myparcel-do/shared';
import {NETHERLANDS, BELGIUM, FRANCE} from '@myparcel/constants/countries';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {useActiveCarriers} from './useActiveCarriers';

describe('useActiveCarriers', () => {
  beforeEach(() => {
    // Reset the state
    useConfigStore().reset();
    useAddressStore().reset();
  });

  const identifiers = [
    `${CarrierName.DhlForYou}:3456`,
    CarrierName.CheapCargo,
    CarrierName.Bol,
    CarrierName.DhlParcelConnect,
    `${CarrierName.DhlForYou}:1234`,
    `${CarrierName.DhlParcelConnect}:422`,
    CarrierName.Bpost,
    CarrierName.PostNl,
    CarrierName.DhlEuroPlus,
    `${CarrierName.PostNl}:4242`,
    CarrierName.DhlForYou,
  ] satisfies CarrierIdentifier[];

  it.each([
    [
      PlatformName.MyParcel,
      NETHERLANDS,
      [
        CarrierName.PostNl,
        `${CarrierName.PostNl}:4242`,
        CarrierName.DhlForYou,
        `${CarrierName.DhlForYou}:1234`,
        `${CarrierName.DhlForYou}:3456`,
        CarrierName.DhlEuroPlus,
      ],
    ],
    [
      PlatformName.MyParcel,
      FRANCE,
      [
        CarrierName.PostNl,
        `${CarrierName.PostNl}:4242`,
        CarrierName.DhlParcelConnect,
        `${CarrierName.DhlParcelConnect}:422`,
        CarrierName.DhlEuroPlus,
      ],
    ],
    [PlatformName.SendMyParcel, BELGIUM, [CarrierName.Bpost, CarrierName.PostNl, `${CarrierName.PostNl}:4242`]],
    [PlatformName.SendMyParcel, NETHERLANDS, [CarrierName.Bpost, CarrierName.PostNl, `${CarrierName.PostNl}:4242`]],
  ] satisfies [SupportedPlatformName, string, CarrierIdentifier[]][])(
    'filters and sorts carriers for "%s" in country "%s"',
    async (platformName, countryCode, expectedOrder) => {
      expect.assertions(1);

      useActiveCarriers.clear();

      const carrierSettings = Object.fromEntries(
        identifiers.map((identifier) => [
          identifier,
          {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        ]),
      );

      mockDeliveryOptionsConfig({
        [KEY_ADDRESS]: {
          [AddressField.Country]: countryCode,
        },
        [KEY_CONFIG]: {
          [ConfigSetting.Platform]: platformName,
          [KEY_CARRIER_SETTINGS]: carrierSettings,
        },
      });

      const carriers = useActiveCarriers();

      await waitForRequestData(useCarriersRequest, []);
      await flushPromises();

      expect(toValue(carriers).map((carrier) => carrier.carrier.value.identifier)).toStrictEqual(expectedOrder);
    },
  );
});
