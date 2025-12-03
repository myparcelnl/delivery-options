import {isCustomEvent} from '@myparcel-dev/shared';
import {type IncomingEventDetail} from '../types/events.types';
import {UPDATE_DELIVERY_OPTIONS} from '../data';
import {mountApp} from './mountApp';

export const initializeApp = (event: Event | CustomEvent): void => {
  // Prevent multiple initializations using the update event
  document.removeEventListener(UPDATE_DELIVERY_OPTIONS, initializeApp);

  const hasData = isCustomEvent<IncomingEventDetail>(event);

  const selector = (hasData ? event.detail.selector : null) ?? `#${__CLASS_BASE__}`;
  const configuration = hasData ? event.detail : undefined;

  mountApp(selector, configuration);
};
