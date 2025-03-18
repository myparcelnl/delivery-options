import {describe, it, expect, beforeEach, vi} from 'vitest';
import {CustomEvent} from 'happy-dom';
import {useSelectedValues} from '../useSelectedValues';
import {useConfigStore} from '../../stores';
import {UNSELECT_DELIVERY_OPTIONS} from '../../data';
import {useDeliveryOptionsIncomingEvents} from './useDeliveryOptionsIncomingEvents';

describe('useDeliveryOptionsIncomingEvents', () => {
  let clearSelectedValues: jest.Mock;

  beforeEach(() => {
    useConfigStore().reset();
    clearSelectedValues = vi.fn();
    vi.spyOn(useSelectedValues(), 'clearSelectedValues').mockImplementation(clearSelectedValues);
    useDeliveryOptionsIncomingEvents();
  });

  it('should call clearSelectedValues when UNSELECT_DELIVERY_OPTIONS event is dispatched', () => {
    const event = new CustomEvent(UNSELECT_DELIVERY_OPTIONS);
    document.dispatchEvent(event);

    expect(clearSelectedValues).toHaveBeenCalled();
  });
});
