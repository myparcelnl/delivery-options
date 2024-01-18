import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {type InternalOutput} from '@myparcel-do/shared';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../../types';
import {useDeliveryOptionsOutgoingEvents} from './useDeliveryOptionsOutgoingEvents';

/**
 * @vitest-environment happy-dom
 */

describe.skip('useDeliveryOptionsOutgoingEvents', () => {
  const dispatchEventSpy = vi.spyOn(global.document, 'dispatchEvent');
  const emitSpy = vi.fn();

  const DEFAULT_VALUES: InternalOutput = Object.freeze({
    deliveryDate: '2023-01-01',
    deliveryMoment: JSON.stringify({
      deliveryType: DeliveryTypeName.Standard,
      date: '',
      packageType: PackageTypeName.Package,
      shipmentOptions: [],
      carrier: CarrierName.PostNl,
      time: '14:00',
    } satisfies SelectedDeliveryMoment),
    shipmentOptions: [],
  });

  const DIFFERENT_VALUES: InternalOutput = Object.freeze({...DEFAULT_VALUES, deliveryDate: '2023-01-02'});

  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    dispatchEventSpy.mockImplementation(() => true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should emit an event with the values', async () => {
    expect.assertions(4);

    const listener = useDeliveryOptionsOutgoingEvents(emitSpy);

    listener(DEFAULT_VALUES);
    vi.runAllTimers();
    await nextTick();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('update', convertOutput(DEFAULT_VALUES));

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy.mock.calls[0][0].detail).toEqual(convertOutput(DEFAULT_VALUES));
  });

  it('should not emit an event if the values are the same', async () => {
    expect.assertions(3);
    const listener = useDeliveryOptionsOutgoingEvents(emitSpy);

    listener(DEFAULT_VALUES);
    vi.runAllTimers();
    await nextTick();

    listener(DEFAULT_VALUES);
    vi.runAllTimers();
    await nextTick();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy.mock.calls[0][0].detail).toEqual(convertOutput(DEFAULT_VALUES));
  });

  it('should emit an event if the values are different', async () => {
    expect.assertions(4);
    const listener = useDeliveryOptionsOutgoingEvents(emitSpy);

    listener(DEFAULT_VALUES);
    vi.runAllTimers();
    await nextTick();

    listener(DIFFERENT_VALUES);
    vi.runAllTimers();
    await nextTick();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
    expect(dispatchEventSpy.mock.calls[0][0].detail).toEqual(convertOutput(DEFAULT_VALUES));
    expect(dispatchEventSpy.mock.calls[1][0].detail).toEqual(convertOutput(DIFFERENT_VALUES));
  });

  it('debounces the emit', async () => {
    expect.assertions(3);

    const listener = useDeliveryOptionsOutgoingEvents(emitSpy);

    listener(DEFAULT_VALUES);
    listener(DIFFERENT_VALUES);
    vi.runAllTimers();
    await nextTick();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy.mock.calls[0][0].detail).toEqual(convertOutput(DIFFERENT_VALUES));
  });
});
