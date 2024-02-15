import {markRaw} from 'vue';
import {type ConfigOption} from '@myparcel-do/shared';
import {type InteractiveElementConfiguration, type ModularCreatedElement} from '@myparcel/vue-form-builder';
import {getComponent} from './getComponent';
import {formField} from './formField';

export const createSandboxField = (
  option: ConfigOption,
  prefix?: string,
  config?: Partial<InteractiveElementConfiguration>,
): ModularCreatedElement => {
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
