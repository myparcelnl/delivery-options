import {toValue} from 'vue';
import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  type CarrierIdentifier,
  KEY_CONFIG,
  ConfigSetting,
  type SupportedPlatformName,
  useCarrierRequest,
  resolveCarrierName,
  waitForRequestData,
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {getResolvedCarrier} from '../utils';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {useActiveCarriers} from './useActiveCarriers';

describe('useActiveCarriers', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    getResolvedCarrier.clear();
    useActiveCarriers.clear();
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
      [
        CarrierName.PostNl,
        `${CarrierName.PostNl}:4242`,
        CarrierName.DhlForYou,
        `${CarrierName.DhlForYou}:1234`,
        `${CarrierName.DhlForYou}:3456`,
        CarrierName.DhlParcelConnect,
        `${CarrierName.DhlParcelConnect}:422`,
        CarrierName.DhlEuroPlus,
      ],
    ],
    [PlatformName.SendMyParcel, [CarrierName.Bpost, CarrierName.PostNl, `${CarrierName.PostNl}:4242`]],
  ] satisfies [SupportedPlatformName, CarrierIdentifier[]][])(
    'filters and sorts carriers for %s',
    async (platformName, expectedOrder) => {
      expect.assertions(1);

      const carrierSettings = Object.fromEntries(
        identifiers.map((identifier) => [identifier, {[CarrierSetting.AllowDeliveryOptions]: true}]),
      );

      mockDeliveryOptionsConfig({
        [KEY_CONFIG]: {
          [ConfigSetting.Platform]: platformName,
          [KEY_CARRIER_SETTINGS]: carrierSettings,
        },
      });

      const carriers = useActiveCarriers();

      await Promise.all(
        identifiers.map((identifier) => {
          return waitForRequestData(useCarrierRequest, [resolveCarrierName(identifier)]);
        }),
      );
      await flushPromises();

      expect(toValue(carriers).map((carrier) => carrier.identifier)).toStrictEqual(expectedOrder);
    },
  );
});
