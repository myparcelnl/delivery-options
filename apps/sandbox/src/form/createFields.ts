import {type Component} from 'vue';
import {type ConfigOption, KEY_CONFIG} from '@myparcel-do/shared';
import {type SettingsField} from '../types/form.types';
import {getComponent} from './getComponent';
import {formField} from './formField';

export const createFields = (option: ConfigOption): SettingsField[] => {
  const component: Component | undefined = undefined;

  return [
    formField({
      name: option.key,
      key: KEY_CONFIG,
      component: component ?? getComponent(option),
    }),
  ];
};
