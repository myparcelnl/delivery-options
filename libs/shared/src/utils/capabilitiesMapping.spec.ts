import {describe, expect, it} from 'vitest';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {CarrierSetting, CustomDeliveryType} from '../data/enums';
import {consoleLogSpy} from '../__tests__/utils/mockConsole';
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
  mapCarrierSettingToCapabilityKeys,
  toDeliveryAllowKey,
  toDeliveryPriceKey,
  CAPABILITY_SETTINGS_PAIRS,
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
    ['SAME_DAY_DELIVERY', CustomDeliveryType.SameDay],
  ] as const)('maps %s -> %s and back', (capType, sdkType) => {
    expect(mapCapabilityDeliveryType(capType)).toBe(sdkType);
    expect(mapDeliveryTypeToCapability(sdkType)).toBe(capType);
  });

  it('returns undefined for unknown delivery type', () => {
    expect(mapCapabilityDeliveryType('NONEXISTENT')).toBeUndefined();
  });

  it('does not log for the same day delivery type', () => {
    mapCapabilityDeliveryType('SAME_DAY_DELIVERY');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('logs a debug message for unmapped delivery type', () => {
    mapCapabilityDeliveryType('NONEXISTENT');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '%c[DEBUG]',
      'color: #999',
      'Unmapped capability delivery type: "NONEXISTENT"',
    );
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

  it('logs a debug message for unmapped package type', () => {
    mapCapabilityPackageType('NONEXISTENT');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '%c[DEBUG]',
      'color: #999',
      'Unmapped capability package type: "NONEXISTENT"',
    );
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

  it('does not log for known-but-ignored options', () => {
    mapCapabilityOption('insurance');
    mapCapabilityOption('scheduledCollection');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('logs a debug message for truly unrecognized options', () => {
    mapCapabilityOption('someNewFutureOption');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '%c[DEBUG]',
      'color: #999',
      'Unmapped capability option: "someNewFutureOption"',
    );
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

describe('toDeliveryAllowKey / toDeliveryPriceKey', () => {
  it.each([
    ['standard', CarrierSetting.AllowStandardDelivery, CarrierSetting.PriceStandardDelivery],
    ['same_day', CarrierSetting.AllowSameDayDelivery, CarrierSetting.PriceSameDayDelivery],
    ['pickup', CarrierSetting.AllowPickupLocations, CarrierSetting.PricePickup],
  ] as const)('derives keys for %s', (sdkType, allowKey, priceKey) => {
    expect(toDeliveryAllowKey(sdkType)).toBe(allowKey);
    expect(toDeliveryPriceKey(sdkType)).toBe(priceKey);
  });
});

describe('CAPABILITY_SETTINGS_PAIRS', () => {
  it('contains no duplicate allow keys', () => {
    const allowKeys = CAPABILITY_SETTINGS_PAIRS.map(([allow]) => allow);

    expect(new Set(allowKeys).size).toBe(allowKeys.length);
  });
});

describe('mapCarrierSettingToCapabilityKeys', () => {
  it.each([
    [CarrierSetting.AllowStandardDelivery, [{type: 'deliveryType', name: 'STANDARD_DELIVERY'}]],
    [CarrierSetting.AllowMorningDelivery, [{type: 'deliveryType', name: 'MORNING_DELIVERY'}]],
    [CarrierSetting.AllowEveningDelivery, [{type: 'deliveryType', name: 'EVENING_DELIVERY'}]],
    [CarrierSetting.AllowPickupLocations, [{type: 'deliveryType', name: 'PICKUP_DELIVERY'}]],
    [CarrierSetting.AllowExpressDelivery, [{type: 'deliveryType', name: 'EXPRESS_DELIVERY'}]],
    [CarrierSetting.AllowSignature, [{type: 'option', name: 'requiresSignature'}]],
    [CarrierSetting.AllowOnlyRecipient, [{type: 'option', name: 'recipientOnlyDelivery'}]],
    [CarrierSetting.AllowPriorityDelivery, [{type: 'option', name: 'priorityDelivery'}]],
    [CarrierSetting.AllowMondayDelivery, [{type: 'option', name: 'mondayDelivery'}]],
    [CarrierSetting.AllowSaturdayDelivery, [{type: 'option', name: 'saturdayDelivery'}]],
    [
      // Same-day is exposed as a delivery type by some carriers and as an option by others.
      CarrierSetting.AllowSameDayDelivery,
      [
        {type: 'deliveryType', name: 'SAME_DAY_DELIVERY'},
        {type: 'option', name: 'sameDayDelivery'},
      ],
    ],
  ])('maps %s to all capability representations', (setting, expected) => {
    expect(mapCarrierSettingToCapabilityKeys(setting)).toEqual(expected);
  });

  it('returns an empty array for unmapped settings', () => {
    expect(mapCarrierSettingToCapabilityKeys(CarrierSetting.Collect)).toEqual([]);
  });
});
