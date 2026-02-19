/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  type CarrierSettingsObject,
  getDefaultCarrierSettings,
  CarrierSetting,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';

const numberBetween = (min: number, max: number): number => {
  const number = Math.random() * (max - min) + min;

  return Number(number.toFixed(2));
};

const SANDBOX_CARRIERS = [
  CarrierName.PostNl,
  CarrierName.DhlForYou,
  CarrierName.DhlParcelConnect,
  CarrierName.DhlEuroPlus,
  CarrierName.UpsStandard,
  CarrierName.UpsExpressSaver,
  CarrierName.Dpd,
] as string[];

export const getDefaultSandboxCarrierSettings = (): CarrierSettingsObject => {
  const defaultCarrierSettings = getDefaultCarrierSettings();

  // Remove per-carrier dropOffDelay and deliveryDaysWindow as they cannot be set in the sandbox UI
  delete defaultCarrierSettings[CarrierSetting.DropOffDelay];
  delete defaultCarrierSettings[CarrierSetting.DeliveryDaysWindow];

  return Object.fromEntries(
    SANDBOX_CARRIERS.map((carrier) => [
      carrier,
      {
        ...defaultCarrierSettings,
        [CarrierSetting.PricePickup]: numberBetween(-2, 0),
        [CarrierSetting.AllowDeliveryOptions]: true,
        [CarrierSetting.AllowStandardDelivery]: true,
        [CarrierSetting.PriceStandardDelivery]: numberBetween(5, 7),
        [CarrierSetting.AllowExpressDelivery]: true,
        [CarrierSetting.PriceExpressDelivery]: numberBetween(10, 15),
        [CarrierSetting.AllowMorningDelivery]: true,
        [CarrierSetting.PriceMorningDelivery]: numberBetween(7, 10),
        [CarrierSetting.AllowEveningDelivery]: true,
        [CarrierSetting.PriceEveningDelivery]: numberBetween(7, 9),
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.PriceSameDayDelivery]: numberBetween(8, 12),
        [CarrierSetting.AllowMondayDelivery]: true,
        [CarrierSetting.PriceMondayDelivery]: numberBetween(6, 8),
        [CarrierSetting.AllowSaturdayDelivery]: true,
        [CarrierSetting.PriceSaturdayDelivery]: numberBetween(6, 8),
        [CarrierSetting.PricePackageTypeDigitalStamp]: numberBetween(1, 3.5),
        [CarrierSetting.PricePackageTypeMailbox]: numberBetween(3, 5),
        [CarrierSetting.PricePackageTypePackageSmall]: numberBetween(2, 4),
        [CarrierSetting.AllowOnlyRecipient]: true,
        [CarrierSetting.PriceOnlyRecipient]: numberBetween(0.1, 0.9),
        [CarrierSetting.AllowSignature]: true,
        [CarrierSetting.PriceSignature]: numberBetween(0.1, 0.9),
        [CarrierSetting.AllowPriorityDelivery]: true,
        [CarrierSetting.PricePriorityDelivery]: numberBetween(0.1, 0.9),
        [CarrierSetting.AllowPickupLocations]: true,
      },
    ]),
  );
};
