import {markRaw, type Ref, ref} from 'vue';
import {
  createField,
  type InteractiveElementConfiguration,
  type ModularCreatedElement,
} from '@myparcel/vue-form-builder';
import {type MakeOptional} from '@myparcel/ts-utils';
import {findSandboxOption, getDefaultValueForType} from '../utils';

interface FormFieldInput<T, Props> extends MakeOptional<InteractiveElementConfiguration<T, Props>, 'ref'> {
  key?: string;
}

export const formField = <T, Props>(input: FormFieldInput<T, Props>): ModularCreatedElement<T, Props> => {
  const fullName: string = [input.key, input.name].filter(Boolean).join('.');

  const fullOption = findSandboxOption(input.name);

  return markRaw(
    createField<T>({
      label: input.name,
      ref: ref(getDefaultValueForType(fullOption?.type)) as Ref<T>,
      ...input,
      name: fullName,
    }),
  );
};
