import type {
  CarrierCapability,
  ConfigPriceKey,
  SupportedDeliveryTypeName,
  SupportedPackageTypeName,
  SupportedShipmentOptionName,
} from '../types';
// Import directly from enum source to avoid circular dependency through barrel.
import {CarrierSetting, type CustomDeliveryType} from '../data/enums';
import {useLogger} from '../composables/useLogger';

/**
 * Normalize a carrier name by lowercasing and removing all underscores.
 * Works for both capabilities format (DHL_FOR_YOU) and SDK format (dhlforyou).
 */
export const normalizeCarrierName = (name: string): string => name.toLowerCase().replace(/_/g, '');

// ─── Source-of-truth maps ──────────────────────────────────────────────────
// To add a new option: add one entry to the right map below.
// CarrierSettings (allow*/price*) are derived by naming convention — see helpers below.

export const DELIVERY_TYPE_MAP: {
  /* eslint-disable @typescript-eslint/naming-convention */
  readonly STANDARD_DELIVERY: 'standard';
  readonly MORNING_DELIVERY: 'morning';
  readonly EVENING_DELIVERY: 'evening';
  readonly EXPRESS_DELIVERY: 'express';
  readonly PICKUP_DELIVERY: 'pickup';
  /* eslint-enable @typescript-eslint/naming-convention */
} = {
  STANDARD_DELIVERY: 'standard',
  MORNING_DELIVERY: 'morning',
  EVENING_DELIVERY: 'evening',
  EXPRESS_DELIVERY: 'express',
  PICKUP_DELIVERY: 'pickup',
};

/** Capability option → SDK request param; allow/price settings follow the same convention. */
export const DELIVERY_DAY_OPTION_MAP: {
  readonly sameDayDelivery: 'same_day_delivery';
  readonly mondayDelivery: 'monday_delivery';
  readonly saturdayDelivery: 'saturday_delivery';
} = {
  sameDayDelivery: 'same_day_delivery',
  mondayDelivery: 'monday_delivery',
  saturdayDelivery: 'saturday_delivery',
};

export const SHIPMENT_OPTION_MAP: {
  readonly requiresSignature: 'signature';
  readonly recipientOnlyDelivery: 'only_recipient';
  readonly priorityDelivery: 'priority_delivery';
} = {
  requiresSignature: 'signature',
  recipientOnlyDelivery: 'only_recipient',
  priorityDelivery: 'priority_delivery',
};

export const PACKAGE_TYPE_MAP: {
  /* eslint-disable @typescript-eslint/naming-convention */
  readonly PACKAGE: 'package';
  readonly MAILBOX: 'mailbox';
  readonly DIGITAL_STAMP: 'digital_stamp';
  readonly SMALL_PACKAGE: 'package_small';
  readonly UNFRANKED: 'letter';
  readonly ENVELOPE: 'envelope';
  readonly PALLET: 'pallet';
  /* eslint-enable @typescript-eslint/naming-convention */
} = {
  PACKAGE: 'package',
  MAILBOX: 'mailbox',
  DIGITAL_STAMP: 'digital_stamp',
  SMALL_PACKAGE: 'package_small',
  UNFRANKED: 'letter',
  ENVELOPE: 'envelope',
  PALLET: 'pallet',
};

// ─── Derived utility types ────────────────────────────────────────────────

type SnakeToCamel<S extends string> = S extends `${infer P}_${infer R}` ? `${P}${Capitalize<SnakeToCamel<R>>}` : S;

/** Type-safe defaults object: { allowSignature: true; allowOnlyRecipient: true; ... } — auto-derived from SHIPMENT_OPTION_MAP. */
export type ShipmentOptionAllowDefaults = {
  [K in (typeof SHIPMENT_OPTION_MAP)[keyof typeof SHIPMENT_OPTION_MAP] as `allow${Capitalize<SnakeToCamel<K>>}`]: true;
};

// ─── Naming-convention helpers ─────────────────────────────────────────────

export const toCamelCase = (str: string): string => str.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const toPascalCase = (str: string): string => capitalize(toCamelCase(str));

/**
 * Delivery types: 'standard' → allowStandardDelivery / priceStandardDelivery.
 * Exception: 'pickup' → allowPickupLocations / pricePickup.
 */
export const toDeliveryAllowKey = (sdk: string): CarrierSetting =>
  sdk === 'pickup' ? CarrierSetting.AllowPickupLocations : (`allow${capitalize(sdk)}Delivery` as CarrierSetting);

export const toDeliveryPriceKey = (sdk: string): CarrierSetting =>
  sdk === 'pickup' ? CarrierSetting.PricePickup : (`price${capitalize(sdk)}Delivery` as CarrierSetting);

/**
 * Shipment options + delivery day SDK params:
 * 'only_recipient' → allowOnlyRecipient / priceOnlyRecipient
 * 'same_day_delivery' → allowSameDayDelivery / priceSameDayDelivery
 */
export const toOptionAllowKey = (sdk: string): CarrierSetting => `allow${toPascalCase(sdk)}` as CarrierSetting;

export const toOptionPriceKey = (sdk: string): CarrierSetting => `price${toPascalCase(sdk)}` as CarrierSetting;

/**
 * Package types: 'mailbox' → pricePackageTypeMailbox
 */
export const toPackagePriceKey = (sdk: string): CarrierSetting =>
  `pricePackageType${toPascalCase(sdk)}` as CarrierSetting;

/**
 * Delivery day SDK params: 'same_day_delivery' → 'same_day' (= CustomDeliveryType.SameDay)
 */
export const toCustomDeliveryType = (sdkParam: string): CustomDeliveryType =>
  sdkParam.replace(/_delivery$/, '') as CustomDeliveryType;

// ─── Derived arrays ────────────────────────────────────────────────────────

/**
 * All delivery type names the widget supports.
 * Replaces the hardcoded SUPPORTED_DELIVERY_TYPES array in constants.ts.
 */
export const SUPPORTED_DELIVERY_TYPES = Object.freeze(Object.values(DELIVERY_TYPE_MAP));

/**
 * All shipment option names the widget supports.
 * Replaces the hardcoded SUPPORTED_SHIPMENT_OPTIONS array in constants.ts.
 */
export const SUPPORTED_SHIPMENT_OPTIONS = Object.freeze(Object.values(SHIPMENT_OPTION_MAP));

/** All shipment options default to allowed. Auto-derived from SHIPMENT_OPTION_MAP. */
export const SHIPMENT_OPTION_ALLOW_DEFAULTS = Object.fromEntries(
  Object.values(SHIPMENT_OPTION_MAP).map((sdk) => [toOptionAllowKey(sdk), true]),
) as ShipmentOptionAllowDefaults;

/**
 * [allowSetting, priceSetting] pairs for every capability-based option.
 * Consumed by getAllConfigOptions to register all options without manual enumeration.
 */
export const CAPABILITY_SETTINGS_PAIRS: readonly [CarrierSetting, ConfigPriceKey][] = [
  ...Object.values(DELIVERY_TYPE_MAP).map((sdk): [CarrierSetting, ConfigPriceKey] => [
    toDeliveryAllowKey(sdk),
    toDeliveryPriceKey(sdk) as ConfigPriceKey,
  ]),
  ...Object.values(DELIVERY_DAY_OPTION_MAP).map((sdk): [CarrierSetting, ConfigPriceKey] => [
    toOptionAllowKey(sdk),
    toOptionPriceKey(sdk) as ConfigPriceKey,
  ]),
  ...Object.values(SHIPMENT_OPTION_MAP).map((sdk): [CarrierSetting, ConfigPriceKey] => [
    toOptionAllowKey(sdk),
    toOptionPriceKey(sdk) as ConfigPriceKey,
  ]),
];

// ─── Derived internal lookup tables ───────────────────────────────────────

const CAPABILITY_DELIVERY_TYPE_MAP: Record<string, SupportedDeliveryTypeName> = {
  ...DELIVERY_TYPE_MAP,
} as Record<string, SupportedDeliveryTypeName>;

const CAPABILITY_PACKAGE_TYPE_MAP: Record<string, SupportedPackageTypeName> = {
  ...PACKAGE_TYPE_MAP,
} as Record<string, SupportedPackageTypeName>;

const CAPABILITY_OPTION_MAP: Record<string, SupportedShipmentOptionName> = {
  ...SHIPMENT_OPTION_MAP,
} as Record<string, SupportedShipmentOptionName>;

/** All capability option keys known from the API — both mapped and intentionally ignored. */
const KNOWN_CAPABILITY_OPTIONS = new Set([
  ...Object.keys(SHIPMENT_OPTION_MAP),
  ...Object.keys(DELIVERY_DAY_OPTION_MAP),
  // Known options not relevant to the widget UI
  'additionalInsurance',
  'cooledDelivery',
  'customLabelText',
  'deliverAtPostalPoint',
  'deliveryDate',
  'freshFood',
  'frozen',
  'hideSender',
  'insurance',
  'noTracking',
  'oversizedPackage',
  'printReturnLabelAtDropOff',
  'requiresAgeVerification',
  'requiresCashOnDelivery',
  'requiresReceiptCode',
  'returnContributionFee',
  'returnOnFirstFailedDelivery',
  'scheduledCollection',
  'tracked',
]);

const CAPABILITY_OPTION_TO_SDK_PARAM: Record<string, string> = {...DELIVERY_DAY_OPTION_MAP};

const CAPABILITY_OPTION_TO_CARRIER_SETTING: Record<string, CarrierSetting> = Object.fromEntries(
  Object.entries(DELIVERY_DAY_OPTION_MAP).map(([capKey, sdkParam]) => [capKey, toOptionAllowKey(sdkParam)]),
);

const CAPABILITY_OPTION_TO_CUSTOM_DELIVERY_TYPE: Record<string, CustomDeliveryType> = Object.fromEntries(
  Object.entries(DELIVERY_DAY_OPTION_MAP).map(([capKey, sdkParam]) => [capKey, toCustomDeliveryType(sdkParam)]),
);

const CARRIER_SETTING_TO_CAPABILITY: Record<string, {type: 'deliveryType' | 'option'; name: string}> =
  Object.fromEntries([
    ...Object.entries(DELIVERY_TYPE_MAP).map(
      ([capKey, sdk]): [string, {type: 'deliveryType' | 'option'; name: string}] => [
        toDeliveryAllowKey(sdk),
        {type: 'deliveryType', name: capKey},
      ],
    ),
    ...Object.entries(DELIVERY_DAY_OPTION_MAP).map(
      ([capKey, sdkParam]): [string, {type: 'deliveryType' | 'option'; name: string}] => [
        toOptionAllowKey(sdkParam),
        {type: 'option', name: capKey},
      ],
    ),
    ...Object.entries(SHIPMENT_OPTION_MAP).map(
      ([capKey, sdk]): [string, {type: 'deliveryType' | 'option'; name: string}] => [
        toOptionAllowKey(sdk),
        {type: 'option', name: capKey},
      ],
    ),
  ]);

// ─── Reverse maps ──────────────────────────────────────────────────────────

const SDK_DELIVERY_TYPE_TO_CAPABILITY: Record<string, string> = Object.fromEntries(
  Object.entries(CAPABILITY_DELIVERY_TYPE_MAP).map(([cap, sdk]) => [sdk, cap]),
);

const SDK_OPTION_TO_CAPABILITY: Record<string, string> = Object.fromEntries(
  Object.entries(CAPABILITY_OPTION_MAP).map(([cap, sdk]) => [sdk, cap]),
);

const SDK_PACKAGE_TYPE_TO_CAPABILITY: Record<string, string> = Object.fromEntries(
  Object.entries(CAPABILITY_PACKAGE_TYPE_MAP).map(([cap, sdk]) => [sdk, cap]),
);

// ─── Exported mapping functions (signatures unchanged) ─────────────────────

/**
 * Map a capabilities delivery type (UPPER_CASE) to its SDK/internal name.
 */
export const mapCapabilityDeliveryType = (capType: string): SupportedDeliveryTypeName | undefined => {
  const mapped = CAPABILITY_DELIVERY_TYPE_MAP[capType];

  if (!mapped) {
    useLogger().debug(`Unmapped capability delivery type: "${capType}"`);
  }

  return mapped;
};

/**
 * Map a capabilities package type (UPPER_CASE) to its SDK/internal name.
 */
export const mapCapabilityPackageType = (capType: string): SupportedPackageTypeName | undefined => {
  const mapped = CAPABILITY_PACKAGE_TYPE_MAP[capType];

  if (!mapped) {
    useLogger().debug(`Unmapped capability package type: "${capType}"`);
  }

  return mapped;
};

/**
 * Map a capabilities option name (camelCase) to its SDK/internal shipment option name.
 * Returns undefined for options not relevant to UI display (e.g. insurance).
 */
export const mapCapabilityOption = (capOption: string): SupportedShipmentOptionName | undefined => {
  const mapped = CAPABILITY_OPTION_MAP[capOption];

  if (!mapped && !KNOWN_CAPABILITY_OPTIONS.has(capOption)) {
    useLogger().debug(`Unmapped capability option: "${capOption}"`);
  }

  return mapped;
};

/**
 * Map capabilities option to SDK parameter name (for delivery day flags).
 */
export const mapCapabilityOptionToSdkParam = (capOption: string): string | undefined =>
  CAPABILITY_OPTION_TO_SDK_PARAM[capOption];

/**
 * Map capabilities option to CarrierSetting allow flag.
 */
export const mapCapabilityOptionToCarrierSetting = (capOption: string): CarrierSetting | undefined =>
  CAPABILITY_OPTION_TO_CARRIER_SETTING[capOption];

/**
 * Map an SDK/internal delivery type name to capabilities format (UPPER_CASE).
 */
export const mapDeliveryTypeToCapability = (sdkType: SupportedDeliveryTypeName): string | undefined =>
  SDK_DELIVERY_TYPE_TO_CAPABILITY[sdkType];

/**
 * Map an SDK/internal shipment option name to capabilities format (camelCase).
 */
export const mapShipmentOptionToCapability = (sdkOption: SupportedShipmentOptionName): string | undefined =>
  SDK_OPTION_TO_CAPABILITY[sdkOption];

/**
 * Map an SDK/internal package type name to capabilities format (UPPER_CASE).
 */
export const mapPackageTypeToCapability = (sdkType: string): string | undefined =>
  SDK_PACKAGE_TYPE_TO_CAPABILITY[sdkType];

/**
 * Map a CarrierSetting allow key to its capabilities equivalent.
 */
export const mapCarrierSettingToCapabilityKey = (
  setting: CarrierSetting,
): {type: 'deliveryType' | 'option'; name: string} | undefined => CARRIER_SETTING_TO_CAPABILITY[setting];

/**
 * Map capabilities delivery-day options to their corresponding CustomDeliveryType values.
 */
export const mapCapabilityOptionToCustomDeliveryType = (capOption: string): CustomDeliveryType | undefined =>
  CAPABILITY_OPTION_TO_CUSTOM_DELIVERY_TYPE[capOption];

/**
 * Extracts all delivery types available for a carrier from its capabilities,
 * including standard delivery types and custom types (same-day, Monday, Saturday)
 * derived from capability options.
 */
export const getCapabilityDeliveryTypes = (cap: CarrierCapability): SupportedDeliveryTypeName[] => {
  const mapped = cap.deliveryTypes
    .map(mapCapabilityDeliveryType)
    .filter((dt): dt is SupportedDeliveryTypeName => dt !== undefined);

  for (const optionName of Object.keys(cap.options)) {
    const customType = mapCapabilityOptionToCustomDeliveryType(optionName);

    if (customType) {
      mapped.push(customType);
    }
  }

  return mapped;
};
