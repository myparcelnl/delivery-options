import {type Component, markRaw, toRaw} from 'vue';
import {useMemoize} from '@vueuse/core';
import {CheckboxInput, ComponentName, RadioInput, SelectInputOrSingle} from '@myparcel-do/shared';

export const getComponent = useMemoize((componentName: ComponentName): Component => {
  const components = Object.freeze({
    [ComponentName.Checkbox]: markRaw(CheckboxInput),
    [ComponentName.Select]: markRaw(SelectInputOrSingle),
    [ComponentName.Radio]: markRaw(RadioInput),
  });

  // @ts-expect-error todo
  const component = components[componentName];

  if (!component) {
    throw new Error(`Component "${componentName}" does not exist in the configuration`);
  }

  return toRaw(component);
});
