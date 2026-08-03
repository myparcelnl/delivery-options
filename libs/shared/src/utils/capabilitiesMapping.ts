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
  readonly SAME_DAY_DELIVERY: 'same_day';
  /* eslint-enable @typescript-eslint/naming-convention */
} = {
  STANDARD_DELIVERY: 'standard',
  MORNING_DELIVERY: 'morning',
  EVENING_DELIVERY: 'evening',
  EXPRESS_DELIVERY: 'express',
  PICKUP_DELIVERY: 'pickup',
  // Some carriers expose same-day as a delivery type instead of (or in addition
  // to) the 'sameDayDelivery' option in DELIVERY_DAY_OPTION_MAP. Both map to the
  // same internal type and the same allow/price/cutoff settings.
  SAME_DAY_DELIVERY: 'same_day',
};

/**
 * Every capability option that is a shipment option, mapped to its delivery options
 * (endpoint) name. This is the single list all shipment option mappings derive from:
 * SHIPMENT_OPTION_MAP (the options a consumer can select in the widget) and the delivery
 * day entries of DELIVERY_DAY_OPTION_MAP are subsets of it, and the plugin's
 * cartShipmentOptions use the camelCase form of these names (e.g. 'age_check' → 'ageCheck').
 */
export const CAPABILITY_TO_SHIPMENT_OPTION = {
  requiresSignature: 'signature',
  recipientOnlyDelivery: 'only_recipient',
  priorityDelivery: 'priority_delivery',
  requiresAgeVerification: 'age_check',
  requiresReceiptCode: 'receipt_code',
  oversizedPackage: 'large_format',
  hideSender: 'hide_sender',
  printReturnLabelAtDropOff: 'return',
  scheduledCollection: 'collect',
  sameDayDelivery: 'same_day_delivery',
  saturdayDelivery: 'saturday_delivery',
  freshFood: 'fresh_food',
  frozen: 'frozen',
  tracked: 'tracked',
} as const;

/**
 * Capability option → SDK request param; allow/price settings follow the same convention.
 * mondayDelivery is deliberately only here: it is a delivery day flag, not a shipment option
 * on the wire.
 */
export const DELIVERY_DAY_OPTION_MAP: {
  readonly sameDayDelivery: 'same_day_delivery';
  readonly mondayDelivery: 'monday_delivery';
  readonly saturdayDelivery: 'saturday_delivery';
} = {
  sameDayDelivery: CAPABILITY_TO_SHIPMENT_OPTION.sameDayDelivery,
  mondayDelivery: 'monday_delivery',
  saturdayDelivery: CAPABILITY_TO_SHIPMENT_OPTION.saturdayDelivery,
};

/** The shipment options a consumer can select in the widget — a subset of the list above. */
export const SHIPMENT_OPTION_MAP: {
  readonly requiresSignature: 'signature';
  readonly recipientOnlyDelivery: 'only_recipient';
  readonly priorityDelivery: 'priority_delivery';
} = {
  requiresSignature: CAPABILITY_TO_SHIPMENT_OPTION.requiresSignature,
  recipientOnlyDelivery: CAPABILITY_TO_SHIPMENT_OPTION.recipientOnlyDelivery,
  priorityDelivery: CAPABILITY_TO_SHIPMENT_OPTION.priorityDelivery,
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
 * Delivery types: 'standard' → allowStandardDelivery / priceStandardDelivery,
 * 'same_day' → allowSameDayDelivery / priceSameDayDelivery.
 * Exception: 'pickup' → allowPickupLocations / pricePickup.
 */
export const toDeliveryAllowKey = (sdk: string): CarrierSetting =>
  sdk === 'pickup' ? CarrierSetting.AllowPickupLocations : (`allow${toPascalCase(sdk)}Delivery` as CarrierSetting);

export const toDeliveryPriceKey = (sdk: string): CarrierSetting =>
  sdk === 'pickup' ? CarrierSetting.PricePickup : (`price${toPascalCase(sdk)}Delivery` as CarrierSetting);

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
  // Same-day appears in both DELIVERY_TYPE_MAP and DELIVERY_DAY_OPTION_MAP and
  // derives identical keys from both; keep the first occurrence of each pair.
].filter(([allowKey], index, pairs) => pairs.findIndex(([other]) => other === allowKey) === index);

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
  ...Object.keys(CAPABILITY_TO_SHIPMENT_OPTION),
  ...Object.keys(DELIVERY_DAY_OPTION_MAP),
  // Known options that are not shipment options in the widget's sense
  'additionalInsurance',
  'cooledDelivery',
  'customLabelText',
  'deliverAtPostalPoint',
  'deliveryDate',
  'insurance',
  'noTracking',
  'requiresCashOnDelivery',
  'returnContributionFee',
  'returnOnFirstFailedDelivery',
]);

/**
 * The plugin's cart option names (camelCase, e.g. 'ageCheck') mapped to delivery options names
 * ('age_check'), so incoming cart data speaks the same vocabulary as the rest of the widget.
 */
const CART_OPTION_TO_SHIPMENT_OPTION: Record<string, string> = Object.fromEntries(
  Object.values(CAPABILITY_TO_SHIPMENT_OPTION).map((name) => [toCamelCase(name), name]),
);

const CAPABILITY_OPTION_TO_SDK_PARAM: Record<string, string> = {...DELIVERY_DAY_OPTION_MAP};

const CAPABILITY_OPTION_TO_CARRIER_SETTING: Record<string, CarrierSetting> = Object.fromEntries(
  Object.entries(DELIVERY_DAY_OPTION_MAP).map(([capKey, sdkParam]) => [capKey, toOptionAllowKey(sdkParam)]),
);

const CAPABILITY_OPTION_TO_CUSTOM_DELIVERY_TYPE: Record<string, CustomDeliveryType> = Object.fromEntries(
  Object.entries(DELIVERY_DAY_OPTION_MAP).map(([capKey, sdkParam]) => [capKey, toCustomDeliveryType(sdkParam)]),
);

/** How a carrier setting is represented in a capabilities response. */
export interface CarrierSettingCapabilityKey {
  type: 'deliveryType' | 'option';
  name: string;
}

const CARRIER_SETTING_CAPABILITY_ENTRIES: [string, CarrierSettingCapabilityKey][] = [
  ...Object.entries(DELIVERY_TYPE_MAP).map(([capKey, sdk]): [string, CarrierSettingCapabilityKey] => [
    toDeliveryAllowKey(sdk),
    {type: 'deliveryType', name: capKey},
  ]),
  ...Object.entries(DELIVERY_DAY_OPTION_MAP).map(([capKey, sdkParam]): [string, CarrierSettingCapabilityKey] => [
    toOptionAllowKey(sdkParam),
    {type: 'option', name: capKey},
  ]),
  ...Object.entries(SHIPMENT_OPTION_MAP).map(([capKey, sdk]): [string, CarrierSettingCapabilityKey] => [
    toOptionAllowKey(sdk),
    {type: 'option', name: capKey},
  ]),
];

/**
 * A carrier setting can have multiple capability representations: same-day is a
 * delivery type on some carriers and an option on others.
 */
const CARRIER_SETTING_TO_CAPABILITIES: Record<string, CarrierSettingCapabilityKey[]> =
  CARRIER_SETTING_CAPABILITY_ENTRIES.reduce((acc, [settingKey, capability]) => {
    (acc[settingKey] ??= []).push(capability);

    return acc;
  }, {} as Record<string, CarrierSettingCapabilityKey[]>);

// ─── Reverse maps ──────────────────────────────────────────────────────────

const SDK_DELIVERY_TYPE_TO_CAPABILITY: Record<string, string> = Object.fromEntries(
  Object.entries(CAPABILITY_DELIVERY_TYPE_MAP).map(([cap, sdk]) => [sdk, cap]),
);

const SHIPMENT_OPTION_TO_CAPABILITY: Record<string, string> = Object.fromEntries(
  Object.entries(CAPABILITY_TO_SHIPMENT_OPTION).map(([capability, name]) => [name, capability]),
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
 * Translate an option name as the plugin sends it in cartShipmentOptions ('ageCheck') to the
 * delivery options name the widget uses everywhere else ('age_check').
 *
 * @param name - The camelCase option name from the plugin.
 * @returns The delivery options name, or undefined when the option is not known.
 */
export const mapCartOptionName = (name: string): string | undefined => CART_OPTION_TO_SHIPMENT_OPTION[name];

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
 * Map a shipment option name ('only_recipient', 'age_check') to its capabilities key
 * ('recipientOnlyDelivery', 'requiresAgeVerification'). Covers every shipment option, not only
 * the ones a consumer can select.
 */
export const mapShipmentOptionToCapability = (name: string): string | undefined =>
  SHIPMENT_OPTION_TO_CAPABILITY[name];

/**
 * Translate capability option keys to the widget's option names, dropping the keys the widget
 * has no option for (insurance, for example). Use it wherever a set of capability keys has to
 * be handed to something that speaks option names.
 *
 * @param capabilityKeys - Capability option keys, e.g. from requires or excludes lists.
 */
export const toShipmentOptionNames = (capabilityKeys: Iterable<string>): Set<string> => {
  const names = new Set<string>();

  for (const capabilityKey of capabilityKeys) {
    const name = mapCapabilityOption(capabilityKey);

    if (name) {
      names.add(name);
    }
  }

  return names;
};

/**
 * Map an SDK/internal package type name to capabilities format (UPPER_CASE).
 */
export const mapPackageTypeToCapability = (sdkType: string): string | undefined =>
  SDK_PACKAGE_TYPE_TO_CAPABILITY[sdkType];

/**
 * Map a CarrierSetting allow key to all its capability representations. Same-day
 * delivery is exposed as a delivery type by some carriers and as an option by
 * others; a carrier supports the setting when any representation matches.
 */
export const mapCarrierSettingToCapabilityKeys = (setting: CarrierSetting): CarrierSettingCapabilityKey[] =>
  CARRIER_SETTING_TO_CAPABILITIES[setting] ?? [];

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

    // A carrier may expose same-day both as a delivery type and as an option;
    // the delivery-type mapping above already added it in that case.
    if (customType && !mapped.includes(customType)) {
      mapped.push(customType);
    }
  }

  return mapped;
};
