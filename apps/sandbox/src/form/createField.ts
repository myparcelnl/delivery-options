import {markRaw} from 'vue';
import {type ConfigOption} from '@myparcel-do/shared';
import {type AnyElementConfiguration} from '@myparcel/vue-form-builder';
import {type SettingsField} from '../types';
import {getComponent} from './getComponent';
import {formField} from './formField';

export const createField = (
  option: ConfigOption,
  prefix?: string,
  config?: Partial<AnyElementConfiguration>,
): SettingsField => {
  return formField({
    name: option.key,
    key: prefix,
    component: markRaw(getComponent(option)),
    validators: option.validators ?? [],
    props: {
      parents: option.parents ?? [],
    },
    ...config,
  });
};
