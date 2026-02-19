import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import type {SupportedDeliveryTypeName, SupportedPackageTypeName, SupportedShipmentOptionName} from '../types';
// Import directly from enum source to avoid circular dependency through barrel.
import {CarrierSetting, CustomDeliveryType} from '../data/enums';

/**
 * Normalize a carrier name by lowercasing and removing all underscores.
 * Works for both capabilities format (DHL_FOR_YOU) and SDK format (dhlforyou).
 */
export const normalizeCarrierName = (name: string): string => {
  return name.toLowerCase().replace(/_/g, '');
};

const CAPABILITY_DELIVERY_TYPE_MAP: Record<string, SupportedDeliveryTypeName> = {
  STANDARD_DELIVERY: DeliveryTypeName.Standard,
  MORNING_DELIVERY: DeliveryTypeName.Morning,
  EVENING_DELIVERY: DeliveryTypeName.Evening,
  PICKUP_DELIVERY: DeliveryTypeName.Pickup,
  EXPRESS_DELIVERY: DeliveryTypeName.Express,
};

/**
 * Map a capabilities delivery type (UPPER_CASE) to its SDK/internal name.
 */
export const mapCapabilityDeliveryType = (capType: string): SupportedDeliveryTypeName | undefined => {
  return CAPABILITY_DELIVERY_TYPE_MAP[capType];
};

const CAPABILITY_PACKAGE_TYPE_MAP: Record<string, SupportedPackageTypeName> = {
  PACKAGE: PackageTypeName.Package,
  MAILBOX: PackageTypeName.Mailbox,
  DIGITAL_STAMP: PackageTypeName.DigitalStamp,
  SMALL_PACKAGE: PackageTypeName.PackageSmall,
  UNFRANKED: 'letter' as SupportedPackageTypeName,
  ENVELOPE: 'envelope' as SupportedPackageTypeName,
  PALLET: 'pallet' as SupportedPackageTypeName,
};

/**
 * Map a capabilities package type (UPPER_CASE) to its SDK/internal name.
 */
export const mapCapabilityPackageType = (capType: string): SupportedPackageTypeName | undefined => {
  return CAPABILITY_PACKAGE_TYPE_MAP[capType];
};

const CAPABILITY_OPTION_MAP: Record<string, SupportedShipmentOptionName> = {
  requiresSignature: ShipmentOptionName.Signature,
  recipientOnlyDelivery: ShipmentOptionName.OnlyRecipient,
  priorityDelivery: ShipmentOptionName.PriorityDelivery,
};

/**
 * Map a capabilities option name (camelCase) to its SDK/internal shipment option name.
 * Returns undefined for options not relevant to UI display (e.g., insurance, insurance, etc.)
 */
export const mapCapabilityOption = (capOption: string): SupportedShipmentOptionName | undefined => {
  return CAPABILITY_OPTION_MAP[capOption];
};

/**
 * Options in capabilities that correspond to special delivery day parameters in the SDK.
 */
const CAPABILITY_OPTION_TO_SDK_PARAM: Record<string, string> = {
  sameDayDelivery: 'same_day_delivery',
  mondayDelivery: 'monday_delivery',
  saturdayDelivery: 'saturday_delivery',
};

/**
 * Options in capabilities that correspond to CarrierSetting allow flags.
 */
const CAPABILITY_OPTION_TO_CARRIER_SETTING: Record<string, CarrierSetting> = {
  sameDayDelivery: CarrierSetting.AllowSameDayDelivery,
  saturdayDelivery: CarrierSetting.AllowSaturdayDelivery,
  mondayDelivery: CarrierSetting.AllowMondayDelivery,
};

/**
 * Map capabilities option to SDK parameter name (for special delivery day flags).
 */
export const mapCapabilityOptionToSdkParam = (capOption: string): string | undefined => {
  return CAPABILITY_OPTION_TO_SDK_PARAM[capOption];
};

/**
 * Map capabilities option to CarrierSetting allow flag.
 */
export const mapCapabilityOptionToCarrierSetting = (capOption: string): CarrierSetting | undefined => {
  return CAPABILITY_OPTION_TO_CARRIER_SETTING[capOption];
};

const SDK_PACKAGE_TYPE_TO_CAPABILITY: Record<string, string> = {
  [PackageTypeName.Package]: 'PACKAGE',
  [PackageTypeName.Mailbox]: 'MAILBOX',
  [PackageTypeName.DigitalStamp]: 'DIGITAL_STAMP',
  [PackageTypeName.PackageSmall]: 'SMALL_PACKAGE',
  letter: 'UNFRANKED',
  envelope: 'ENVELOPE',
  pallet: 'PALLET',
};

/**
 * Map an SDK/internal package type name to capabilities format (UPPER_CASE).
 */
export const mapPackageTypeToCapability = (sdkType: string): string | undefined => {
  return SDK_PACKAGE_TYPE_TO_CAPABILITY[sdkType];
};

const CARRIER_SETTING_TO_CAPABILITY: Record<string, {type: 'deliveryType' | 'option'; name: string}> = {
  [CarrierSetting.AllowSignature]: {type: 'option', name: 'requiresSignature'},
  [CarrierSetting.AllowOnlyRecipient]: {type: 'option', name: 'recipientOnlyDelivery'},
  [CarrierSetting.AllowPriorityDelivery]: {type: 'option', name: 'priorityDelivery'},
  [CarrierSetting.AllowStandardDelivery]: {type: 'deliveryType', name: 'STANDARD_DELIVERY'},
  [CarrierSetting.AllowMorningDelivery]: {type: 'deliveryType', name: 'MORNING_DELIVERY'},
  [CarrierSetting.AllowEveningDelivery]: {type: 'deliveryType', name: 'EVENING_DELIVERY'},
  [CarrierSetting.AllowPickupLocations]: {type: 'deliveryType', name: 'PICKUP_DELIVERY'},
  [CarrierSetting.AllowExpressDelivery]: {type: 'deliveryType', name: 'EXPRESS_DELIVERY'},
  [CarrierSetting.AllowSameDayDelivery]: {type: 'option', name: 'sameDayDelivery'},
  [CarrierSetting.AllowSaturdayDelivery]: {type: 'option', name: 'saturdayDelivery'},
};

/**
 * Map a CarrierSetting allow key to its capabilities equivalent.
 */
export const mapCarrierSettingToCapabilityKey = (
  setting: CarrierSetting,
): {type: 'deliveryType' | 'option'; name: string} | undefined => {
  return CARRIER_SETTING_TO_CAPABILITY[setting];
};

/**
 * Map capabilities delivery-day options (sameDayDelivery, mondayDelivery, saturdayDelivery)
 * to their corresponding CustomDeliveryType values.
 */
const CAPABILITY_OPTION_TO_CUSTOM_DELIVERY_TYPE: Record<string, CustomDeliveryType> = {
  sameDayDelivery: CustomDeliveryType.SameDay,
  mondayDelivery: CustomDeliveryType.Monday,
  saturdayDelivery: CustomDeliveryType.Saturday,
};

/**
 * Map capabilities option to CustomDeliveryType (for options that act as delivery types).
 */
export const mapCapabilityOptionToCustomDeliveryType = (capOption: string): CustomDeliveryType | undefined => {
  return CAPABILITY_OPTION_TO_CUSTOM_DELIVERY_TYPE[capOption];
};
