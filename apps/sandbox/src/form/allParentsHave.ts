import {type FormInstance} from '@myparcel/vue-form-builder';

export const allParentsHave = (parents: undefined | string[], form: FormInstance, prefix: string): boolean => {
  return (parents ?? []).every((parent) => {
    const value = form.getValue(prefix ? `${prefix}.${parent}` : parent);

    return Boolean(value);
  });
};
