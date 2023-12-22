import {markRaw, type Ref, ref} from 'vue';
import {
  createField,
  type InteractiveElementConfiguration,
  type ModularCreatedElement,
} from '@myparcel/vue-form-builder';
import {type MakeOptional} from '@myparcel/ts-utils';

interface FormFieldInput<T, Props> extends MakeOptional<InteractiveElementConfiguration<T, Props>, 'ref'> {
  key?: string;
}

export const formField = <T, Props>(input: FormFieldInput<T, Props>): ModularCreatedElement<T, Props> => {
  const fullName: string = [input.key, input.name].filter(Boolean).join('.');

  return markRaw(
    createField<T>({
      label: input.name,
      ref: ref() as Ref<T>,
      ...input,
      name: fullName,
    }),
  );
};
