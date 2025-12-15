import {markRaw, type Ref, ref} from 'vue';
import {getDefaultValueForType, type AnyTranslatable} from '@myparcel-dev/shared';
import {
  type ComponentProps,
  createField,
  type InteractiveElementConfiguration,
  type ModularCreatedElement,
} from '@myparcel/vue-form-builder';
import {findSandboxOption, createOptionTranslatable} from '../utils';

export interface FormFieldInput<T = unknown, Props extends ComponentProps = ComponentProps>
  extends Omit<InteractiveElementConfiguration<T, Props>, 'label' | 'ref'> {
  key?: string;
  label?: AnyTranslatable;
  ref?: Ref<T>;
}

export const formField = <T, Props extends ComponentProps = ComponentProps>(
  input: FormFieldInput<T, Props>,
): ModularCreatedElement<T, Props> => {
  const fullName: string = [input.key, input.name].filter(Boolean).join('.');

  const fullOption = findSandboxOption(input.name);
  return markRaw(
    createField<T>({
      // @ts-expect-error todo
      label: createOptionTranslatable(input.name),
      ref: ref(getDefaultValueForType(fullOption?.type)) as Ref<T>,
      ...input,
      name: fullName,
      props: {
        description: createOptionTranslatable(`${input.name}_description`),
        ...(input.props ?? {}),
      },
    }),
  );
};
