import {describe, expect, it} from 'vitest';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {CarrierSetting, CustomDeliveryType} from '../data';
import {
  normalizeCarrierName,
  mapCapabilityDeliveryType,
  mapDeliveryTypeToCapability,
  mapCapabilityPackageType,
  mapPackageTypeToCapability,
  mapCapabilityOption,
  mapShipmentOptionToCapability,
  mapCapabilityOptionToSdkParam,
  mapCapabilityOptionToCarrierSetting,
  mapCapabilityOptionToCustomDeliveryType,
  mapCarrierSettingToCapabilityKey,
} from './capabilitiesMapping';

describe('normalizeCarrierName', () => {
  it.each([
    ['DHL_FOR_YOU', 'dhlforyou'],
    ['POSTNL', 'postnl'],
    ['DHL_PARCEL_CONNECT', 'dhlparcelconnect'],
    ['dhlforyou', 'dhlforyou'],
    ['postnl', 'postnl'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeCarrierName(input)).toBe(expected);
  });
});

describe('mapCapabilityDeliveryType / mapDeliveryTypeToCapability', () => {
  it.each([
    ['STANDARD_DELIVERY', DeliveryTypeName.Standard],
    ['MORNING_DELIVERY', DeliveryTypeName.Morning],
    ['EVENING_DELIVERY', DeliveryTypeName.Evening],
    ['PICKUP_DELIVERY', DeliveryTypeName.Pickup],
    ['EXPRESS_DELIVERY', DeliveryTypeName.Express],
  ] as const)('maps %s -> %s and back', (capType, sdkType) => {
    expect(mapCapabilityDeliveryType(capType)).toBe(sdkType);
    expect(mapDeliveryTypeToCapability(sdkType)).toBe(capType);
  });

  it('returns undefined for unknown delivery type', () => {
    expect(mapCapabilityDeliveryType('NONEXISTENT')).toBeUndefined();
  });
});

describe('mapCapabilityPackageType / mapPackageTypeToCapability', () => {
  it.each([
    ['PACKAGE', PackageTypeName.Package],
    ['MAILBOX', PackageTypeName.Mailbox],
    ['DIGITAL_STAMP', PackageTypeName.DigitalStamp],
    ['SMALL_PACKAGE', PackageTypeName.PackageSmall],
    ['UNFRANKED', 'letter'],
    ['ENVELOPE', 'envelope'],
    ['PALLET', 'pallet'],
  ] as const)('maps %s -> %s and back', (capType, sdkType) => {
    expect(mapCapabilityPackageType(capType)).toBe(sdkType);
    expect(mapPackageTypeToCapability(sdkType as string)).toBe(capType);
  });

  it('returns undefined for unknown package type', () => {
    expect(mapCapabilityPackageType('NONEXISTENT')).toBeUndefined();
  });
});

describe('mapCapabilityOption / mapShipmentOptionToCapability', () => {
  it.each([
    ['requiresSignature', ShipmentOptionName.Signature],
    ['recipientOnlyDelivery', ShipmentOptionName.OnlyRecipient],
    ['priorityDelivery', ShipmentOptionName.PriorityDelivery],
  ] as const)('maps %s -> %s and back', (capOption, sdkOption) => {
    expect(mapCapabilityOption(capOption)).toBe(sdkOption);
    expect(mapShipmentOptionToCapability(sdkOption)).toBe(capOption);
  });

  it('returns undefined for unknown option', () => {
    expect(mapCapabilityOption('unknownOption')).toBeUndefined();
  });
});

describe('mapCapabilityOptionToSdkParam', () => {
  it.each([
    ['sameDayDelivery', 'same_day_delivery'],
    ['mondayDelivery', 'monday_delivery'],
    ['saturdayDelivery', 'saturday_delivery'],
  ])('maps %s -> %s', (capOption, sdkParam) => {
    expect(mapCapabilityOptionToSdkParam(capOption)).toBe(sdkParam);
  });

  it('returns undefined for non-delivery-day option', () => {
    expect(mapCapabilityOptionToSdkParam('requiresSignature')).toBeUndefined();
  });
});

describe('mapCapabilityOptionToCarrierSetting', () => {
  it.each([
    ['sameDayDelivery', CarrierSetting.AllowSameDayDelivery],
    ['saturdayDelivery', CarrierSetting.AllowSaturdayDelivery],
    ['mondayDelivery', CarrierSetting.AllowMondayDelivery],
  ])('maps %s -> %s', (capOption, setting) => {
    expect(mapCapabilityOptionToCarrierSetting(capOption)).toBe(setting);
  });

  it('returns undefined for non-delivery-day option', () => {
    expect(mapCapabilityOptionToCarrierSetting('requiresSignature')).toBeUndefined();
  });
});

describe('mapCapabilityOptionToCustomDeliveryType', () => {
  it.each([
    ['sameDayDelivery', CustomDeliveryType.SameDay],
    ['mondayDelivery', CustomDeliveryType.Monday],
    ['saturdayDelivery', CustomDeliveryType.Saturday],
  ])('maps %s -> %s', (capOption, customType) => {
    expect(mapCapabilityOptionToCustomDeliveryType(capOption)).toBe(customType);
  });

  it('returns undefined for non-delivery-day option', () => {
    expect(mapCapabilityOptionToCustomDeliveryType('requiresSignature')).toBeUndefined();
  });
});

describe('mapCarrierSettingToCapabilityKey', () => {
  it.each([
    [CarrierSetting.AllowSignature, {type: 'option', name: 'requiresSignature'}],
    [CarrierSetting.AllowOnlyRecipient, {type: 'option', name: 'recipientOnlyDelivery'}],
    [CarrierSetting.AllowPriorityDelivery, {type: 'option', name: 'priorityDelivery'}],
    [CarrierSetting.AllowStandardDelivery, {type: 'deliveryType', name: 'STANDARD_DELIVERY'}],
    [CarrierSetting.AllowMorningDelivery, {type: 'deliveryType', name: 'MORNING_DELIVERY'}],
    [CarrierSetting.AllowEveningDelivery, {type: 'deliveryType', name: 'EVENING_DELIVERY'}],
    [CarrierSetting.AllowPickupLocations, {type: 'deliveryType', name: 'PICKUP_DELIVERY'}],
    [CarrierSetting.AllowExpressDelivery, {type: 'deliveryType', name: 'EXPRESS_DELIVERY'}],
    [CarrierSetting.AllowSameDayDelivery, {type: 'option', name: 'sameDayDelivery'}],
    [CarrierSetting.AllowSaturdayDelivery, {type: 'option', name: 'saturdayDelivery'}],
  ])('maps %s to correct shape', (setting, expected) => {
    expect(mapCarrierSettingToCapabilityKey(setting)).toEqual(expected);
  });

  it('returns undefined for unmapped setting', () => {
    expect(mapCarrierSettingToCapabilityKey(CarrierSetting.Collect)).toBeUndefined();
  });
});
