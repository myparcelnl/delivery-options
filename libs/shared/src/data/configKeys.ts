// Properties

import {type PlatformName} from '@myparcel/constants';
import {type DeliveryOptionsConfig} from '../types';
import {CarrierSetting, ConfigSetting} from '../enums';

export const API_BASE_URL = ConfigSetting.ApiBaseUrl satisfies keyof DeliveryOptionsConfig;

export const CURRENCY = ConfigSetting.Currency satisfies keyof DeliveryOptionsConfig;

export const LOCALE = ConfigSetting.Locale satisfies keyof DeliveryOptionsConfig;

export const PLATFORM = ConfigSetting.Platform satisfies keyof DeliveryOptionsConfig;

export const SHOW_PRICES = ConfigSetting.ShowPrices satisfies keyof DeliveryOptionsConfig;

export const SHOW_PRICE_SURCHARGE = ConfigSetting.ShowPriceSurcharge satisfies keyof DeliveryOptionsConfig;

export const PACKAGE_TYPE = CarrierSetting.PackageType satisfies keyof DeliveryOptionsConfig;

export const ALLOW_DELIVERY_OPTIONS = CarrierSetting.AllowDeliveryOptions satisfies keyof DeliveryOptionsConfig;

export const ALLOW_EVENING_DELIVERY = CarrierSetting.AllowEveningDelivery satisfies keyof DeliveryOptionsConfig;

export const ALLOW_MORNING_DELIVERY = CarrierSetting.AllowMorningDelivery satisfies keyof DeliveryOptionsConfig;

export const ALLOW_ONLY_RECIPIENT = CarrierSetting.AllowOnlyRecipient satisfies keyof DeliveryOptionsConfig;

export const ALLOW_PICKUP_LOCATIONS = CarrierSetting.AllowPickupLocations satisfies keyof DeliveryOptionsConfig;

export const ALLOW_SAME_DAY_DELIVERY = CarrierSetting.AllowSameDayDelivery satisfies keyof DeliveryOptionsConfig;

export const ALLOW_SIGNATURE = CarrierSetting.AllowSignature satisfies keyof DeliveryOptionsConfig;

export const CUTOFF_TIME = CarrierSetting.CutoffTime satisfies keyof DeliveryOptionsConfig;

export const CUTOFF_TIME_SAME_DAY = CarrierSetting.CutoffTimeSameDay satisfies keyof DeliveryOptionsConfig;

export const DELIVERY_DAYS_WINDOW = CarrierSetting.DeliveryDaysWindow satisfies keyof DeliveryOptionsConfig;

export const DROP_OFF_DAYS = CarrierSetting.DropOffDays satisfies keyof DeliveryOptionsConfig;

export const DROP_OFF_DELAY = CarrierSetting.DropOffDelay satisfies keyof DeliveryOptionsConfig;

export const PRICE_EVENING_DELIVERY = CarrierSetting.PriceEveningDelivery satisfies keyof DeliveryOptionsConfig;

export const PRICE_MORNING_DELIVERY = CarrierSetting.PriceMorningDelivery satisfies keyof DeliveryOptionsConfig;

export const PRICE_ONLY_RECIPIENT = CarrierSetting.PriceOnlyRecipient satisfies keyof DeliveryOptionsConfig;

export const PRICE_PICKUP = CarrierSetting.PricePickup satisfies keyof DeliveryOptionsConfig;

export const PRICE_SAME_DAY_DELIVERY = CarrierSetting.PriceSameDayDelivery satisfies keyof DeliveryOptionsConfig;

export const PRICE_SIGNATURE = CarrierSetting.PriceSignature satisfies keyof DeliveryOptionsConfig;

export const PRICE_STANDARD_DELIVERY = CarrierSetting.PriceStandardDelivery satisfies keyof DeliveryOptionsConfig;

export const PRICE_MONDAY_DELIVERY = CarrierSetting.PriceMondayDelivery satisfies keyof DeliveryOptionsConfig;

export const PRICE_SATURDAY_DELIVERY = CarrierSetting.PriceSaturdayDelivery satisfies keyof DeliveryOptionsConfig;

/*
 * Package types
 */
export const ALLOW_PACKAGE_TYPE_DIGITAL_STAMP =
  CarrierSetting.AllowPackageTypeDigitalStamp satisfies keyof DeliveryOptionsConfig;

export const ALLOW_PACKAGE_TYPE_MAILBOX = CarrierSetting.AllowPackageTypeMailbox satisfies keyof DeliveryOptionsConfig;

export const PRICE_PACKAGE_TYPE_DIGITAL_STAMP =
  CarrierSetting.PricePackageTypeDigitalStamp satisfies keyof DeliveryOptionsConfig;

export const PRICE_PACKAGE_TYPE_MAILBOX = CarrierSetting.PricePackageTypeMailbox satisfies keyof DeliveryOptionsConfig;

/*
 * For use with Monday delivery.
 */
export const ALLOW_MONDAY_DELIVERY =
  CarrierSetting.AllowMondayDelivery satisfies keyof DeliveryOptionsConfig<PlatformName.MyParcel>;

export const SATURDAY_CUTOFF_TIME =
  CarrierSetting.SaturdayCutoffTime satisfies keyof DeliveryOptionsConfig<PlatformName.MyParcel>;

/*
 * For use with Saturday delivery.
 */
export const ALLOW_SATURDAY_DELIVERY =
  CarrierSetting.AllowSaturdayDelivery satisfies keyof DeliveryOptionsConfig<PlatformName.SendMyParcel>;

export const FRIDAY_CUTOFF_TIME =
  CarrierSetting.FridayCutoffTime satisfies keyof DeliveryOptionsConfig<PlatformName.SendMyParcel>;

/*
 * Carrier settings object
 */
export const CARRIER_SETTINGS = ConfigSetting.CarrierSettings satisfies keyof DeliveryOptionsConfig;

// Extra features

/*
 * The default view of pickup locations.
 */
export const FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW =
  ConfigSetting.PickupLocationsDefaultView satisfies keyof DeliveryOptionsConfig;

/*
 * Show distance under each pickup location if true. Otherwise, shows street name and number.
 */
export const FEATURE_PICKUP_SHOW_DISTANCE = ConfigSetting.PickupShowDistance satisfies keyof DeliveryOptionsConfig;

/*
 * Show delivery date label or select if true. Hide otherwise.
 */
export const FEATURE_SHOW_DELIVERY_DATE = ConfigSetting.ShowDeliveryDate satisfies keyof DeliveryOptionsConfig;

/*
 * Tile layer data for use with the pickup locations map.
 */
export const PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA =
  ConfigSetting.PickupLocationsMapTileLayerData satisfies keyof DeliveryOptionsConfig;

/** @deprecated */
export const settingsWithCarrierOverride = [
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  CUTOFF_TIME,
  CUTOFF_TIME_SAME_DAY,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  FEATURE_SHOW_DELIVERY_DATE,
  PRICE_EVENING_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  PRICE_PACKAGE_TYPE_MAILBOX,
  PRICE_PICKUP,
  PRICE_SAME_DAY_DELIVERY,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
];

/** @deprecated */
export const settingsWithCountryOverrides = [ALLOW_DELIVERY_OPTIONS, ALLOW_PICKUP_LOCATIONS];

/** @deprecated */
export const carrierFeatures = [
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ALLOW_PACKAGE_TYPE_MAILBOX,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  CUTOFF_TIME,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  FEATURE_SHOW_DELIVERY_DATE,
] as const;
