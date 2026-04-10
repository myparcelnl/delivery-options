import {describe, it, expect} from 'vitest';
import {type CarrierCapability, CustomDeliveryType} from '@myparcel-dev/do-shared';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {getCapabilityDeliveryTypes} from './getCapabilityDeliveryTypes';

const createCapability = (
  deliveryTypes: string[] = [],
  options: Record<
    string,
    {requires: string[]; excludes: string[]; isSelectedByDefault: boolean; isRequired: boolean}
  > = {},
): CarrierCapability => ({
  carrier: 'TEST',
  packageTypes: [],
  deliveryTypes,
  options,
});

describe('getCapabilityDeliveryTypes', () => {
  it('maps standard delivery types to SDK names', () => {
    const cap = createCapability(['STANDARD_DELIVERY', 'MORNING_DELIVERY', 'EVENING_DELIVERY']);

    expect(getCapabilityDeliveryTypes(cap)).toEqual([
      DeliveryTypeName.Standard,
      DeliveryTypeName.Morning,
      DeliveryTypeName.Evening,
    ]);
  });

  it('filters out unmapped delivery types', () => {
    const cap = createCapability(['STANDARD_DELIVERY', 'UNKNOWN_TYPE']);

    expect(getCapabilityDeliveryTypes(cap)).toEqual([DeliveryTypeName.Standard]);
  });

  it('includes custom delivery types from options', () => {
    const cap = createCapability(['STANDARD_DELIVERY'], {
      sameDayDelivery: {requires: [], excludes: [], isSelectedByDefault: false, isRequired: false},
      saturdayDelivery: {requires: [], excludes: [], isSelectedByDefault: false, isRequired: false},
    });

    expect(getCapabilityDeliveryTypes(cap)).toEqual([
      DeliveryTypeName.Standard,
      CustomDeliveryType.SameDay,
      CustomDeliveryType.Saturday,
    ]);
  });

  it('returns empty array for empty capabilities', () => {
    const cap = createCapability();

    expect(getCapabilityDeliveryTypes(cap)).toEqual([]);
  });

  it('handles delivery types without options', () => {
    const cap = createCapability(['EXPRESS_DELIVERY']);

    expect(getCapabilityDeliveryTypes(cap)).toEqual([DeliveryTypeName.Express]);
  });

  it('ignores non-delivery-type options', () => {
    const cap = createCapability([], {
      requiresSignature: {requires: [], excludes: [], isSelectedByDefault: false, isRequired: false},
      recipientOnlyDelivery: {requires: [], excludes: [], isSelectedByDefault: false, isRequired: false},
    });

    expect(getCapabilityDeliveryTypes(cap)).toEqual([]);
  });
});
