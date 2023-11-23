import {computed, toRefs, type WritableComputedRef} from 'vue';
import {get, useVModel} from '@vueuse/core';
import {type ElementContext, type ElementEmits, type ElementProps} from '../../types';
import {generateFieldId} from './generateFieldId';

export const useElementContext = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T1 = any,
  T2 = T1,
  Props extends ElementProps<T1> = ElementProps<T1>,
  Emits extends ElementEmits<T2> = ElementEmits<T2>,
>(
  props: Props,
  emit: Emits,
): ElementContext<T1, Props> => {
  const propRefs = toRefs(props);

  const id = generateFieldId(propRefs.element);
  const model = useVModel(props, undefined, emit) as WritableComputedRef<T1>;

  return {
    id,
    model,
    elementProps: computed(() => {
      return {
        ...propRefs.element.value.props,
        id,
        disabled: get(propRefs.element.value.isDisabled) || get(propRefs.element.value.isSuspended),
        readonly: get(propRefs.element.value.isReadOnly),
      };
    }),
  };
};
