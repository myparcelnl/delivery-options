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

const apps = new Map<string, App>();

if (import.meta.env.DEV && !window.hasOwnProperty('MyParcelConfig')) {
  window.onload = showDeveloperInfo;
}

const mountApp = (selector: string, configuration: InputDeliveryOptionsConfiguration | undefined): void => {
  const app = createApp(MyParcelDeliveryOptions, {configuration});

  app.use(createPinia());
  app.use(createMyParcelFormBuilderPlugin());

  app.mount(selector);
  apps.set(selector, app);
};

const initialize = (event: Event | CustomEvent): void => {
  // Prevent multiple initializations using the update event
  document.removeEventListener(UPDATE_DELIVERY_OPTIONS, initialize);

  const hasData = isCustomEvent<IncomingEventDetail>(event);
  const selector = (hasData ? event.detail.selector : null) ?? `#${__CLASS_BASE__}`;

  if (RENDER_DELIVERY_OPTIONS === event.type && apps.has(selector)) {
    apps.get(selector)?.unmount();
  }

  mountApp(selector, hasData ? event.detail : undefined);
};

document.addEventListener(RENDER_DELIVERY_OPTIONS, initialize);
document.addEventListener(UPDATE_DELIVERY_OPTIONS, initialize);
