import {describe, it, expect, beforeEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {useSelectedValues} from './useSelectedValues';

describe('useSelectedValues', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should clear selected values', () => {
    const {deliveryDate, deliveryMoment, homeOrPickup, pickupLocation, shipmentOptions, clearSelectedValues} =
      useSelectedValues();

    deliveryDate.value = '2023-12-25';
    deliveryMoment.value = 'morning';
    homeOrPickup.value = 'pickup';
    pickupLocation.value = 'Location A';
    shipmentOptions.value = ['option1', 'option2'];

    clearSelectedValues();

    expect(deliveryDate.value).toBeUndefined();
    expect(deliveryMoment.value).toBeUndefined();
    expect(homeOrPickup.value).toBe('home');
    expect(pickupLocation.value).toBeUndefined();
    expect(shipmentOptions.value).toEqual([]);
  });
});
