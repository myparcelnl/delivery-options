import {useMemoize} from '@vueuse/core';
import {PackageTypeName} from '@myparcel-dev/constants';
import {validateIsInRange} from '../validator';
import {type ConfigOption} from '../types';
import {
  CarrierSetting,
  ConfigSetting,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  OptionType,
} from '../data';
import {declareOptionWithPrice} from './declareOptionWithPrice';
import {declareOption} from './declareOption';

// eslint-disable-next-line max-lines-per-function
export const getAllConfigOptions = useMemoize((): ConfigOption[] => [
  declareOption({key: CarrierSetting.AllowDeliveryOptions, perCarrier: true}),

  ...declareOptionWithPrice(CarrierSetting.AllowStandardDelivery, CarrierSetting.PriceStandardDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowExpressDelivery, CarrierSetting.PriceExpressDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowMorningDelivery, CarrierSetting.PriceMorningDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowEveningDelivery, CarrierSetting.PriceEveningDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowSameDayDelivery, CarrierSetting.PriceSameDayDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowMondayDelivery, CarrierSetting.PriceMondayDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowSaturdayDelivery, CarrierSetting.PriceSaturdayDelivery),

  ...declareOptionWithPrice(CarrierSetting.AllowOnlyRecipient, CarrierSetting.PriceOnlyRecipient),
  ...declareOptionWithPrice(CarrierSetting.AllowSignature, CarrierSetting.PriceSignature),

  ...declareOptionWithPrice(CarrierSetting.AllowPickupLocations, CarrierSetting.PricePickup),

  ...declareOptionWithPrice(PackageTypeName.Mailbox, CarrierSetting.PricePackageTypeMailbox),
  ...declareOptionWithPrice(PackageTypeName.DigitalStamp, CarrierSetting.PricePackageTypeDigitalStamp),
  ...declareOptionWithPrice(PackageTypeName.PackageSmall, CarrierSetting.PricePackageTypePackageSmall),

  declareOption({
    key: CarrierSetting.DropOffDelay,
    type: OptionType.Number,
    validators: [validateIsInRange(DROP_OFF_DELAY_MIN, DROP_OFF_DELAY_MAX)],
  }),

  declareOption({
    key: CarrierSetting.DeliveryDaysWindow,
    type: OptionType.Number,
    validators: [validateIsInRange(DELIVERY_DAYS_WINDOW_MIN, DELIVERY_DAYS_WINDOW_MAX)],
  }),

  declareOption({
    key: ConfigSetting.PickupLocationsDefaultView,
    type: OptionType.Select,
  }),

  declareOption(ConfigSetting.PickupShowDistance),
  declareOption(ConfigSetting.ShowDeliveryDate),
  declareOption(ConfigSetting.ShowPriceSurcharge),

  declareOption({
    key: ConfigSetting.PickupLocationsMapTileLayerData,
    type: OptionType.String,
  }),

  declareOption({
    key: ConfigSetting.PickupMapAllowLoadMore,
    type: OptionType.Boolean,
  }),

  declareOption({
    key: ConfigSetting.ShowPriceZeroAsFree,
    type: OptionType.Boolean,
  }),
]);
