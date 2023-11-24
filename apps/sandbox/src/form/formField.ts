import {markRaw, ref} from 'vue';
import {type AnyElementConfiguration, createField, type ModularCreatedField} from '@myparcel/vue-form-builder';

type FormFieldInput = AnyElementConfiguration & {
  key?: string;
};

export const formField = (input: FormFieldInput): ModularCreatedField => {
  const fullName: string = [input.key, input.name].filter(Boolean).join('.');

  return markRaw(
    createField({
      label: input.name,
      ref: ref(),
      ...input,
      name: fullName,
    }),
  );
};
