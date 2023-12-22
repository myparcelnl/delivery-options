import {useEventListener} from '@vueuse/core';
import {type InputDeliveryOptionsConfiguration, useLogger} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import {getConfigFromWindow} from '../utils';
import {UPDATE_CONFIG_IN, UPDATE_DELIVERY_OPTIONS} from '../data';
import {setConfiguration} from '../config';

export const useDeliveryOptionsIncomingEvents = (): void => {
  const logger = useLogger();

  const updateConfigFromEvent = (event: Event | CustomEvent) => {
    const isCustomEvent = isOfType<CustomEvent>(event, 'detail');
    const newConfig: InputDeliveryOptionsConfiguration = isCustomEvent ? event.detail : getConfigFromWindow();

    logger.debug(`Received configuration from ${isCustomEvent ? 'event' : 'window'}`, newConfig);

    setConfiguration(newConfig);
  };

  useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfigFromEvent);
  useEventListener(document, UPDATE_CONFIG_IN, updateConfigFromEvent);
};
