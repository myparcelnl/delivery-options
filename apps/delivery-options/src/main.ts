import './assets/base.scss';
import './assets/index.scss';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {createMyParcelFormBuilderPlugin} from '@myparcel/vue-form-builder';
import {MyParcelDeliveryOptions} from './views';
import {isCustomEvent} from './utils/isCustomEvent';
import {showDeveloperInfo} from './utils';
import {UPDATE_DELIVERY_OPTIONS} from './data';

if (import.meta.env.DEV && !window.hasOwnProperty('MyParcelConfig')) {
  window.onload = showDeveloperInfo;
}

const mountApp = (selector: string): void => {
  const app = createApp(MyParcelDeliveryOptions);

  app.use(createPinia());
  app.use(createMyParcelFormBuilderPlugin());

  app.mount(selector);
};

const initialize = (event: Event | CustomEvent): void => {
  // Prevent multiple initializations using this event
  document.removeEventListener(UPDATE_DELIVERY_OPTIONS, initialize);

  const hasData = isCustomEvent<{selector?: string}>(event);

  const selector = (hasData ? event.detail.selector : null) ?? `#${__CLASS_BASE__}`;

  mountApp(selector);
};

document.addEventListener(UPDATE_DELIVERY_OPTIONS, initialize);
