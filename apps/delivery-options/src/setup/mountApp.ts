/* eslint-disable @typescript-eslint/naming-convention,no-underscore-dangle */
import {type App, createApp} from 'vue';
import {createPinia} from 'pinia';
import {type InputDeliveryOptionsConfiguration} from '@myparcel-dev/do-shared';
import {MyParcelDeliveryOptions} from '../views';

export const mountApp = (selector: string, configuration: InputDeliveryOptionsConfiguration | undefined): void => {
  const element = document.querySelector<Element & {__vue_app__?: App}>(selector);

  /**
   * Unmount the app if it's already mounted on the same selector.
   */
  if (element?.__vue_app__) {
    element.__vue_app__?.unmount();
  }

  const app = createApp(MyParcelDeliveryOptions, {configuration});

  app.use(createPinia());

  app.mount(selector);
};
