import {
  KEY_CONFIG,
  ConfigSetting,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  type InputDeliveryOptionsConfiguration,
} from '@myparcel-do/shared';
import {TEST_VALUE_MAP_CARRIERS, TEST_VALUE_MAP_CUSTOM_CONTRACTS, TEST_VALUE_MAP_PRICES} from '../constants';
import {getMockDeliveryOptionsConfiguration} from './getMockDeliveryOptionsConfiguration';

/**
 * Make a big configuration object with all possible settings using the values from the TestValue maps.
 */
export const createTestConfiguration = (): InputDeliveryOptionsConfiguration => {
  const carriers = Object.entries(TEST_VALUE_MAP_CARRIERS);

  const carrierSettings = carriers.reduce((settingsAcc, [carrierName, carrierValue]) => {
    const contracts = Object.entries(TEST_VALUE_MAP_CUSTOM_CONTRACTS);

    return {
      ...settingsAcc,
      ...contracts.reduce((contractsAcc, [contractKey, contractValue]) => {
        const prices = Object.entries(TEST_VALUE_MAP_PRICES);
        const resolvedCarrierName = `${carrierName}${Number(contractKey) > 0 ? `:${contractKey}` : ''}`;

        const settings = prices.reduce((pricesAcc, [priceKey, priceValue]) => {
          return {...pricesAcc, [priceKey]: carrierValue | contractValue | priceValue};
        }, {});

        return {...contractsAcc, [resolvedCarrierName]: settings};
      }, {}),
    };
  }, {});

  return {
    ...getMockDeliveryOptionsConfiguration(),
    [KEY_CONFIG]: {
      [ConfigSetting.ShowDeliveryDate]: true,
      [CarrierSetting.AllowDeliveryOptions]: true,
      [CarrierSetting.AllowEveningDelivery]: true,
      [CarrierSetting.AllowMondayDelivery]: true,
      [CarrierSetting.AllowMorningDelivery]: true,
      [CarrierSetting.AllowOnlyRecipient]: true,
      [CarrierSetting.AllowPickupLocations]: true,
      [CarrierSetting.AllowSameDayDelivery]: true,
      [CarrierSetting.AllowSaturdayDelivery]: true,
      [CarrierSetting.AllowSignature]: true,
      [CarrierSetting.AllowStandardDelivery]: true,
      [CarrierSetting.AllowExpressDelivery]: true,
      ...Object.entries(TEST_VALUE_MAP_PRICES).reduce((acc, [optionKey, priceValue]) => {
        return {...acc, [optionKey]: priceValue};
      }, {}),
      [KEY_CARRIER_SETTINGS]: carrierSettings,
    },
  };
};
