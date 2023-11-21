import {KEY_CONFIG} from '@myparcel-do/shared';
import {type SettingsField} from '../types';
import {getComponent} from './getComponent';
import {formField} from './formField';

export const createField = (option: ConfigOption): SettingsField => {
  return formField({
    name: option.key,
    key: KEY_CONFIG,
    component: getComponent(option),
    validators: option.validators ?? [],
    props: {
      parents: option.parents ?? [],
    },
  });
};
