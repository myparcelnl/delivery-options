/* eslint-disable @typescript-eslint/naming-convention,no-underscore-dangle */
import {type App, createApp} from 'vue';
import {createPinia} from 'pinia';
import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {createMyParcelFormBuilderPlugin} from '@myparcel/vue-form-builder';
import {MyParcelDeliveryOptions} from '../views';
import {useKvStore} from '../stores';

export const mountApp = (selector: string, configuration: InputDeliveryOptionsConfiguration | undefined): void => {
  const element = document.querySelector<Element & {__vue_app__?: App}>(selector);

  /**
   * Unmount the app if the element is no longer connected to the DOM.
   */
  const kv = useKvStore();
  const key = 'element';
  const el = kv.get<Element & {__vue_app__?: App}>(key);

  if (el && !el.isConnected) {
    el.__vue_app__?.unmount();
  }

  // remember for use here, but also when unmounting on event UNMOUNT_APP
  kv.set(key, element);

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
