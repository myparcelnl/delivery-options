import './assets/base.scss';
import './assets/index.scss';
import {type App, createApp} from 'vue';
import {createPinia} from 'pinia';
import {type InputDeliveryOptionsConfiguration, isCustomEvent} from '@myparcel-do/shared';
import {createMyParcelFormBuilderPlugin} from '@myparcel/vue-form-builder';
import {MyParcelDeliveryOptions} from './views';
import {showDeveloperInfo} from './utils';
import {type IncomingEventDetail} from './types/events.types';
import {RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS} from './data';

if (import.meta.env.DEV && !window.hasOwnProperty('MyParcelConfig')) {
  window.onload = showDeveloperInfo;
}

/* eslint-disable @typescript-eslint/naming-convention,no-underscore-dangle */
const mountApp = (selector: string, configuration: InputDeliveryOptionsConfiguration | undefined): void => {
  const element = document.querySelector<Element & {__vue_app__?: App}>(selector);

  /**
   * Unmount the app if it's already mounted on the same selector.
   */
  if (element?.__vue_app__) {
    element.__vue_app__?.unmount();
  }

  const app = createApp(MyParcelDeliveryOptions, {configuration});

  app.use(createPinia());
  app.use(createMyParcelFormBuilderPlugin());

  app.mount(selector);
};

const initialize = (event: Event | CustomEvent): void => {
  // Prevent multiple initializations using the update event
  document.removeEventListener(UPDATE_DELIVERY_OPTIONS, initialize);

  const hasData = isCustomEvent<IncomingEventDetail>(event);

  const selector = (hasData ? event.detail.selector : null) ?? `#${__CLASS_BASE__}`;
  const configuration = hasData ? event.detail : undefined;

  mountApp(selector, configuration);
};

document.addEventListener(RENDER_DELIVERY_OPTIONS, initialize);
document.addEventListener(UPDATE_DELIVERY_OPTIONS, initialize);
