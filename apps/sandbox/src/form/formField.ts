import {ref, toRaw} from 'vue';
import {type AnyElementConfiguration, createField} from '@myparcel/vue-form-builder';
import {type SettingsField} from '../types';

export const formField = (
  input: AnyElementConfiguration & {
    key?: string;
  },
): SettingsField => {
  const fullName: string = [input.key, input.name].filter(Boolean).join('.');

  return toRaw(
    createField({
      label: input.name,
      ref: ref(),
      ...input,
      name: fullName,
    }),
  );
};
