import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {CustomDeliveryType} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {getResolvedDeliveryType} from './getResolvedDeliveryType';

describe('getResolvedDeliveryType', () => {
  beforeEach(() => {
    getResolvedDeliveryType.clear();
    vi.setSystemTime(new Date('2022-01-01'));
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns delivery type for regular day', () => {
    expect(getResolvedDeliveryType('2022-01-04', DeliveryTypeName.Standard)).toBe(DeliveryTypeName.Standard);
  });

  it('returns Monday delivery type for Monday', () => {
    expect(getResolvedDeliveryType('2022-01-03', DeliveryTypeName.Standard)).toBe(CustomDeliveryType.Monday);
  });

  it('returns Saturday delivery type for Saturday', () => {
    expect(getResolvedDeliveryType('2022-01-08', DeliveryTypeName.Standard)).toBe(CustomDeliveryType.Saturday);
  });

  it.each([DeliveryTypeName.Morning, DeliveryTypeName.Evening])(
    'returns delivery type for non-standard delivery type',
    (input) => {
      expect(getResolvedDeliveryType('2022-01-08', input)).toBe(input);
    },
  );

  it('returns same day delivery type for today', () => {
    expect(getResolvedDeliveryType('2022-01-01', DeliveryTypeName.Standard)).toBe(CustomDeliveryType.SameDay);
  });
});
