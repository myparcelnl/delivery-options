import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {type DateLike} from '@vueuse/core';
import {CustomDeliveryType, SUPPORTED_DELIVERY_TYPES, type SupportedDeliveryTypeName} from '@myparcel-dev/do-shared';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {getResolvedDeliveryType} from './getResolvedDeliveryType';

const SATURDAY = '2022-01-08';
const MONDAY = '2022-01-03';

describe('getResolvedDeliveryType', () => {
  const allDeliveryTypes = SUPPORTED_DELIVERY_TYPES as unknown as SupportedDeliveryTypeName[];

  beforeEach(async () => {
    getResolvedDeliveryType.clear();
    vi.setSystemTime(new Date('2022-01-01'));
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns delivery type for regular day', async () => {
    expect(getResolvedDeliveryType(allDeliveryTypes, '2022-01-04', DeliveryTypeName.Standard)).toBe(
      DeliveryTypeName.Standard,
    );
  });

  it.each([DeliveryTypeName.Morning, DeliveryTypeName.Evening])(
    'returns delivery type for non-standard delivery type',
    (input) => {
      expect(getResolvedDeliveryType(allDeliveryTypes, SATURDAY, input)).toBe(input);
    },
  );

  it('returns same day delivery type for today', () => {
    expect(getResolvedDeliveryType(allDeliveryTypes, '2022-01-01', DeliveryTypeName.Standard)).toBe(
      CustomDeliveryType.SameDay,
    );
  });

  describe.each([
    [CustomDeliveryType.Monday, MONDAY],
    [CustomDeliveryType.Saturday, SATURDAY],
  ] satisfies [CustomDeliveryType, DateLike][])('custom delivery type %s', (deliveryType, date) => {
    it(`returns ${deliveryType} delivery type on matching day`, () => {
      expect(getResolvedDeliveryType([deliveryType], date, DeliveryTypeName.Standard)).toBe(deliveryType);
    });

    it('returns standard delivery if day is not a custom delivery type', () => {
      expect(getResolvedDeliveryType([], date, DeliveryTypeName.Standard)).toBe(DeliveryTypeName.Standard);
    });
  });
});
