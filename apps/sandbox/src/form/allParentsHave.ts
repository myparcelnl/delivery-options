import {type FormInstance} from '@myparcel/vue-form-builder';
import {findSandboxOption} from '../utils';

export const allParentsHave = (parents: undefined | string[], form: FormInstance, prefix: string): boolean => {
  return (parents ?? []).every((parent) => {
    const optionName = prefix ? `${prefix}.${parent}` : parent;
    const parentOption = findSandboxOption(parent);

    const value = form.values[optionName] ?? false;

    return Boolean(value) && parentOption && allParentsHave(parentOption.parents, form, prefix);
  });
};
