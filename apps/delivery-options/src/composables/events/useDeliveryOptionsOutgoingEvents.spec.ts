import {defineComponent} from 'vue';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {CustomEvent} from 'happy-dom';
import {flushPromises} from '@vue/test-utils';
import {render, type RenderResult} from '@testing-library/vue';
import {useConfigStore} from '../../stores';
import {FIELD_DELIVERY_MOMENT, FIELD_DELIVERY_DATE, UPDATED_DELIVERY_OPTIONS} from '../../data';
import {
  createInternalOutput,
  createExternalOutput,
  mockDeliveryOptionsForm,
  mockSelectedDeliveryOptions,
} from '../../__tests__';
import {useDeliveryOptionsOutgoingEvents} from './useDeliveryOptionsOutgoingEvents';

/**
 * @vitest-environment happy-dom
 */
const flush = async (): Promise<void> => {
  await flushPromises();
  // Timers need to be run manually because the callback is debounced
  vi.runAllTimers();
};

describe('useDeliveryOptionsOutgoingEvents', () => {
  const dispatchEventSpy = vi.spyOn(global.document, 'dispatchEvent');
  const emitSpy = vi.fn();

  const renderComponent = async (): Promise<RenderResult> => {
    await mockDeliveryOptionsForm();

    return render(
      defineComponent({
        render: () => null,
        setup() {
          useDeliveryOptionsOutgoingEvents(emitSpy);
        },
      }),
    );
  };

  const DEFAULT_VALUES = createInternalOutput({
    [FIELD_DELIVERY_DATE]: '2023-01-01 14:00:00',
    [FIELD_DELIVERY_MOMENT]: {date: '2023-01-01 14:00:00', time: '14:00'},
  });

  const DIFFERENT_VALUES = createInternalOutput({
    [FIELD_DELIVERY_DATE]: '2023-01-02 16:00:00',
    [FIELD_DELIVERY_MOMENT]: {date: '2023-01-02 16:00:00', time: '16:00'},
  });

  beforeEach(async () => {
    vi.useFakeTimers();
    useConfigStore().reset();
    dispatchEventSpy.mockImplementation(() => true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should emit an event with the values', async () => {
    expect.assertions(7);

    await renderComponent();
    mockSelectedDeliveryOptions(DEFAULT_VALUES);
    await flush();

    const output = createExternalOutput({
      date: '2023-01-01 14:00:00',
      shipmentOptions: {
        onlyRecipient: false,
        signature: false,
      },
    });

    expect(emitSpy).toHaveBeenCalledOnce();
    expect(dispatchEventSpy).toHaveBeenCalledOnce();
    expect(emitSpy).toHaveBeenCalledWith('update', output);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));

    const firstEvent = dispatchEventSpy.mock.calls[0][0];

    expect(firstEvent).toBeInstanceOf(CustomEvent);
    expect(firstEvent?.type).toEqual(UPDATED_DELIVERY_OPTIONS);
    expect((firstEvent as unknown as CustomEvent)?.detail).toEqual(output);
  });

  it('should only emit an event if the new values are different', async () => {
    expect.assertions(2);

    await renderComponent();

    mockSelectedDeliveryOptions(DEFAULT_VALUES);
    await flush();

    mockSelectedDeliveryOptions(DEFAULT_VALUES);
    await flush();

    expect(emitSpy).toHaveBeenCalledOnce();
    expect(dispatchEventSpy).toHaveBeenCalledOnce();
  });

  it('should emit another event if the values are different', async () => {
    expect.assertions(2);

    await renderComponent();

    mockSelectedDeliveryOptions(DEFAULT_VALUES);
    await flush();

    mockSelectedDeliveryOptions(DIFFERENT_VALUES);
    await flush();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
  });

  it('debounces the emit', async () => {
    expect.assertions(2);

    await renderComponent();

    mockSelectedDeliveryOptions(DEFAULT_VALUES);
    mockSelectedDeliveryOptions(DIFFERENT_VALUES);
    await flush();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });

  it('does nothing if no delivery options are selected', async () => {
    expect.assertions(2);

    await renderComponent();

    // Not calling mockSelectedDeliveryOptions
    await flush();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  it('removes the listener on unmount', async () => {
    expect.assertions(2);

    const {unmount} = await renderComponent();

    unmount();

    mockSelectedDeliveryOptions(DEFAULT_VALUES);
    await flush();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });
});
