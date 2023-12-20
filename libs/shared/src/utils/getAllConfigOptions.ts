import {useMemoize} from '@vueuse/core';
import {validateIsInRange} from '../validator';
import {type ConfigOption} from '../types';
import {CarrierSetting, ConfigSetting, OptionType} from '../enums';
import {
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  PRICE_STANDARD_DELIVERY,
} from '../data';
import {declareOptionWithPrice} from './declareOptionWithPrice';
import {declareOption} from './declareOption';

// eslint-disable-next-line max-lines-per-function
export const getAllConfigOptions = useMemoize((): ConfigOption[] => [
  ...declareOptionWithPrice({key: CarrierSetting.AllowDeliveryOptions, perCarrier: true}, PRICE_STANDARD_DELIVERY),

  ...declareOptionWithPrice(CarrierSetting.AllowStandardDelivery, CarrierSetting.PriceStandardDelivery),

  ...declareOptionWithPrice(CarrierSetting.AllowMondayDelivery, CarrierSetting.PriceMondayDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowSaturdayDelivery, CarrierSetting.PriceSaturdayDelivery),

  ...declareOptionWithPrice(CarrierSetting.AllowMorningDelivery, CarrierSetting.PriceMorningDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowEveningDelivery, CarrierSetting.PriceEveningDelivery),
  ...declareOptionWithPrice(CarrierSetting.AllowSameDayDelivery, CarrierSetting.PriceSameDayDelivery),

  ...declareOptionWithPrice(CarrierSetting.AllowOnlyRecipient, CarrierSetting.PriceOnlyRecipient),
  ...declareOptionWithPrice(CarrierSetting.AllowSignature, CarrierSetting.PriceSignature),

  ...declareOptionWithPrice(CarrierSetting.AllowPickupLocations, CarrierSetting.PricePickup),

  ...declareOptionWithPrice(CarrierSetting.AllowPackageTypeMailbox, CarrierSetting.PricePackageTypeMailbox),
  ...declareOptionWithPrice(CarrierSetting.AllowPackageTypeDigitalStamp, CarrierSetting.PricePackageTypeDigitalStamp),

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
]);
