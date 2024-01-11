import {markRaw, type Ref, ref} from 'vue';
import {
  type ComponentProps,
  createField,
  type InteractiveElementConfiguration,
  type ModularCreatedElement,
} from '@myparcel/vue-form-builder';
import {type MakeOptional} from '@myparcel/ts-utils';
import {findSandboxOption, getDefaultValueForType} from '../utils';

interface FormFieldInput<T, Props extends ComponentProps = ComponentProps>
  extends MakeOptional<InteractiveElementConfiguration<T, Props>, 'ref'> {
  key?: string;
}

export const formField = <T, Props extends ComponentProps = ComponentProps>(
  input: FormFieldInput<T, Props>,
): ModularCreatedElement<T, Props> => {
  const fullName: string = [input.key, input.name].filter(Boolean).join('.');

  const fullOption = findSandboxOption(input.name);
  const optionLabel = `option_${input.name}`;

  return markRaw(
    createField<T>({
      label: optionLabel,
      ref: ref(getDefaultValueForType(fullOption?.type)) as Ref<T>,
      ...input,
      name: fullName,
      props: {
        description: `${optionLabel}_description`,
        ...(input.props ?? {}),
      },
    }),
  );
};
