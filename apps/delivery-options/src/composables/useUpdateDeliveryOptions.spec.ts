import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {waitForEvent} from '@myparcel-do/shared/testing';
import {type DeliveryOptionsOutput, UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {useUpdateDeliveryOptions} from './useUpdateDeliveryOptions';

/**
 * @vitest-environment happy-dom
 */

describe('useUpdateDeliveryOptions', () => {
  const dispatchEventSpy = vi.fn();
  const emitSpy = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    global.document.dispatchEvent = dispatchEventSpy;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should emit an event with the values', async () => {
    expect.assertions(2);
    const wait = waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const update = useUpdateDeliveryOptions(emitSpy);
    const values = {carrier: 'postnl', delivery: 'deliver', pickup: 'pickup'} as unknown as DeliveryOptionsOutput;

    update(values);
    vi.runAllTimers();

    await wait;

    expect(global.document.dispatchEvent.mock.calls).toEqual([values]);
    expect(emitSpy).toHaveBeenCalledWith('update', values);
  });

  it('should not emit an event if the values are the same', () => {
    const update = useUpdateDeliveryOptions(emitSpy);

    const values = {carrier: 'postnl', delivery: 'deliver', pickup: 'pickup'} as unknown as DeliveryOptionsOutput;

    update(values);
    vi.runAllTimers();
    update(values);
    vi.runAllTimers();

    expect(global.document.dispatchEvent.mock.call).toEqual([values]);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit an event if the values are different', () => {
    const update = useUpdateDeliveryOptions(emitSpy);

    const values = {carrier: 'postnl', delivery: 'deliver', pickup: 'pickup'} as unknown as DeliveryOptionsOutput;
    const differentValues = {carrier: 'dhl', delivery: 'deliver', pickup: 'pickup'} as unknown as DeliveryOptionsOutput;

    update(values);
    update(differentValues);

    expect(global.document.dispatchEvent.mock.calls).toEqual([values, differentValues]);
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

  it('debounces the emit', async () => {
    expect.assertions(2);

    const wait = waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const update = useUpdateDeliveryOptions(emitSpy);

    const values = {carrier: 'postnl', delivery: 'deliver', pickup: 'pickup'} as unknown as DeliveryOptionsOutput;

    update(values);
    update({...values, carrier: 'dhl'});
    vi.runAllTimers();

    await wait;
    expect(global.document.dispatchEvent.mock.calls).toEqual([values]);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
