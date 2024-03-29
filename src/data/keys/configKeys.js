export const KEY = 'config';

// Properties
export const API_BASE_URL = 'apiBaseUrl';
export const CURRENCY = 'currency';
export const LOCALE = 'locale';
export const PLATFORM = 'platform';
export const SHOW_PRICES = 'showPrices';
export const SHOW_PRICE_SURCHARGE = 'showPriceSurcharge';

export const PACKAGE_TYPE = 'packageType';

export const ALLOW_DELIVERY_OPTIONS = 'allowDeliveryOptions';
export const ALLOW_EVENING_DELIVERY = 'allowEveningDelivery';
export const ALLOW_MORNING_DELIVERY = 'allowMorningDelivery';
export const ALLOW_ONLY_RECIPIENT = 'allowOnlyRecipient';
export const ALLOW_PICKUP_LOCATIONS = 'allowPickupLocations';
export const ALLOW_SAME_DAY_DELIVERY = 'allowSameDayDelivery';
export const ALLOW_SIGNATURE = 'allowSignature';

export const CUTOFF_TIME = 'cutoffTime';
export const CUTOFF_TIME_SAME_DAY = 'cutoffTimeSameDay';
export const DELIVERY_DAYS_WINDOW = 'deliveryDaysWindow';
export const DROP_OFF_DAYS = 'dropOffDays';
export const DROP_OFF_DELAY = 'dropOffDelay';

export const PRICE_EVENING_DELIVERY = 'priceEveningDelivery';
export const PRICE_MORNING_DELIVERY = 'priceMorningDelivery';
export const PRICE_ONLY_RECIPIENT = 'priceOnlyRecipient';
export const PRICE_PICKUP = 'pricePickup';
export const PRICE_SAME_DAY_DELIVERY = 'priceSameDayDelivery';
export const PRICE_SIGNATURE = 'priceSignature';
export const PRICE_STANDARD_DELIVERY = 'priceStandardDelivery';

/*
 * Package types
 */
export const ALLOW_PACKAGE_TYPE_DIGITAL_STAMP = 'allowPackageTypeDigitalStamp';
export const ALLOW_PACKAGE_TYPE_MAILBOX = 'allowPackageTypeMailbox';
export const ALLOW_PACKAGE_TYPE_PACKAGE_SMALL = 'allowPackageTypePackageSmall';
export const PRICE_PACKAGE_TYPE_DIGITAL_STAMP = 'pricePackageTypeDigitalStamp';
export const PRICE_PACKAGE_TYPE_MAILBOX = 'pricePackageTypeMailbox';
export const PRICE_PACKAGE_TYPE_PACKAGE_SMALL = 'pricePackageTypePackageSmall';

/*
 * For use with Monday delivery.
 */
export const ALLOW_MONDAY_DELIVERY = 'allowMondayDelivery';
export const SATURDAY_CUTOFF_TIME = 'saturdayCutoffTime';
export const SUNDAY_CUTOFF_TIME = 'sundayCutoffTime';

/*
 * For use with Saturday delivery.
 */
export const ALLOW_SATURDAY_DELIVERY = 'allowSaturdayDelivery';
export const FRIDAY_CUTOFF_TIME = 'fridayCutoffTime';

/*
 * Carrier settings object
 */
export const CARRIER_SETTINGS = 'carrierSettings';

// Extra features

/*
 * Allow a retry modal to let the user re-enter their address on error.
 */
export const FEATURE_ALLOW_RETRY = 'allowRetry';

/*
 * The default view of pickup locations.
 */
export const FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW = 'pickupLocationsDefaultView';

/*
 * Show distance under each pickup location if true. Otherwise, shows street name and number.
 */
export const FEATURE_PICKUP_SHOW_DISTANCE = 'pickupShowDistance';

/*
 * Show delivery date label or select if true. Hide otherwise.
 */
export const FEATURE_SHOW_DELIVERY_DATE = 'allowShowDeliveryDate';

/*
 * Tile layer data for use with the pickup locations map.
 */
export const PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA = 'pickupLocationsMapTileLayerData';

/*
 * Max amount of pickup locations shown.
 */
export const FEATURE_MAX_PAGE_ITEMS = 'maxPageItems';

/**
 * These settings can be overridden by the carrierSettings object in the config.
 *
 * @type {Array}
 */
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
  PRICE_PACKAGE_TYPE_PACKAGE_SMALL,
  PRICE_PICKUP,
  PRICE_SAME_DAY_DELIVERY,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
  SATURDAY_CUTOFF_TIME,
  SUNDAY_CUTOFF_TIME,
];

/**
 * Settings that can be set per country.
 *
 * @type {(string)[]}
 */
export const settingsWithCountryOverrides = [
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_PICKUP_LOCATIONS,
];

/**
 * @type {string[]}
 */
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
];
