import {type Component, toRaw} from 'vue';
import {type ComponentName, useDeliveryOptionsStore} from '@myparcel-do/shared';

export const getComponent = (componentName: ComponentName): Component => {
  const store = useDeliveryOptionsStore();

  const component = store.configuration.components[componentName] ?? null;

  if (!component) {
    throw new Error(`Component "${componentName}" does not exist in the configuration`);
  }

  return toRaw(component);
};
