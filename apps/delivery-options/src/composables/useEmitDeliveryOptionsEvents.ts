import {useEventListener} from '@vueuse/core';
import {
  type DeliveryOptionsConfiguration,
  UPDATE_CONFIG_IN,
  UPDATE_DELIVERY_OPTIONS,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';

export function useEmitDeliveryOptionsEvents(): void {
  const store = useDeliveryOptionsStore();

  const updateConfigFromEvent = (event: Event | CustomEvent) => {
    const newConfig: DeliveryOptionsConfiguration = isOfType<CustomEvent>(event, 'detail')
      ? event.detail
      : window.MyParcelConfig;

    store.updateConfiguration(newConfig);
  };

  useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfigFromEvent);
  useEventListener(document, UPDATE_CONFIG_IN, updateConfigFromEvent);
}