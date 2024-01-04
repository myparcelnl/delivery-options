import {useMemoize} from '@vueuse/core';
import {type ConfigOption} from '@myparcel-do/shared';
import {type FormInstance} from '@myparcel/vue-form-builder';
import {getAllSandboxConfigOptions} from './getAllSandboxConfigOptions';

const findSandboxOption = useMemoize((option: string): ConfigOption | undefined => {
  const options = getAllSandboxConfigOptions();

  return options.find((item) => item.key === option);
});

export const allParentsHave = (parents: undefined | string[], form: FormInstance, prefix: string): boolean => {
  return (parents ?? []).every((parent) => {
    const optionName = prefix ? `${prefix}.${parent}` : parent;
    const parentOption = findSandboxOption(parent);

    const value = form.getValue(optionName);

    return Boolean(value) && parentOption && allParentsHave(parentOption.parents, form, prefix);
  });
};
