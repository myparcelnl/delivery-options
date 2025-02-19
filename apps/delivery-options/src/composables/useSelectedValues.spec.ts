import {describe, it, expect, beforeEach} from 'vitest';
import {useSelectedValues} from './useSelectedValues';

describe('useSelectedValues', () => {
  let selectedValues: ReturnType<typeof useSelectedValues>;

  beforeEach(() => {
    selectedValues = useSelectedValues();
  });

  it('should clear selected values', () => {
    const {deliveryDate, deliveryMoment, homeOrPickup, pickupLocation, shipmentOptions, clearSelectedValues} =
      selectedValues;

    deliveryDate.value = '2023-12-25';
    deliveryMoment.value = 'morning';
    homeOrPickup.value = 'pickup';
    pickupLocation.value = 'Location A';
    shipmentOptions.value = ['option1', 'option2'];

    clearSelectedValues();

    expect(deliveryDate.value).toBe('2023-12-25');
    expect(deliveryMoment.value).toBeUndefined();
    expect(homeOrPickup.value).toBe('home');
    expect(pickupLocation.value).toBeUndefined();
    expect(shipmentOptions.value).toEqual([]);
  });
});
