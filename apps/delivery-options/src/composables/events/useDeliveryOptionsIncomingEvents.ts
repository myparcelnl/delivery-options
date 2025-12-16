import type {App} from 'vue';
import {useEventListener} from '@vueuse/core';
import {type InputDeliveryOptionsConfiguration, isCustomEvent, useLogger} from '@myparcel-do/shared';
import {useSelectedValues} from '../useSelectedValues';
import {getConfigFromWindow} from '../../utils';
import {useKvStore} from '../../stores';
import {UPDATE_CONFIG_IN, UPDATE_DELIVERY_OPTIONS, UNSELECT_DELIVERY_OPTIONS, UNMOUNT_APP} from '../../data';
import {setConfiguration} from '../../config';

export const useDeliveryOptionsIncomingEvents = (): void => {
  const logger = useLogger();
  const {clearSelectedValues} = useSelectedValues();
  const updateConfigFromEvent = (event: Event | CustomEvent<InputDeliveryOptionsConfiguration>) => {
    const hasDetail = isCustomEvent(event);
    const newConfig: InputDeliveryOptionsConfiguration = hasDetail ? event.detail : getConfigFromWindow();

    if (import.meta.env.DEV) {
      logger.debug(`Received configuration from ${hasDetail ? 'event' : 'window'}`, newConfig);
    }

    setConfiguration(newConfig);
  };

  const unmountAppFromEvent = (): void => {
    const kv = useKvStore();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const el = kv.get<Element & {__vue_app__?: App}>('element');
    // eslint-disable-next-line no-underscore-dangle
    el?.__vue_app__?.unmount();
  };

  useEventListener(document, UPDATE_DELIVERY_OPTIONS, updateConfigFromEvent);
  useEventListener(document, UPDATE_CONFIG_IN, updateConfigFromEvent);
  useEventListener(document, UNMOUNT_APP, unmountAppFromEvent);

  useEventListener(document, UNSELECT_DELIVERY_OPTIONS, () => {
    clearSelectedValues();
  });
};
