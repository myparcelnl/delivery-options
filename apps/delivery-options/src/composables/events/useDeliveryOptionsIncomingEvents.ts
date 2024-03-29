import {useEventListener} from '@vueuse/core';
import {type InputDeliveryOptionsConfiguration, isCustomEvent, useLogger} from '@myparcel-do/shared';
import {getConfigFromWindow} from '../../utils';
import {UPDATE_CONFIG_IN, UPDATE_DELIVERY_OPTIONS} from '../../data';
import {setConfiguration} from '../../config';

export const useDeliveryOptionsIncomingEvents = (): void => {
  const logger = useLogger();

  const updateConfigFromEvent = (event: Event | CustomEvent<InputDeliveryOptionsConfiguration>) => {
    const hasDetail = isCustomEvent(event);

    const newConfig: InputDeliveryOptionsConfiguration = hasDetail ? event.detail : getConfigFromWindow();

    if (import.meta.env.DEV) logger.debug(`Received configuration from ${hasDetail ? 'event' : 'window'}`, newConfig);

    setConfiguration(newConfig);
  };

  useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfigFromEvent);
  useEventListener(document, UPDATE_CONFIG_IN, updateConfigFromEvent);
};
