import {computed} from 'vue';
import {get, toRefs, useVModel} from '@vueuse/core';
import {type WritableComputedRef} from '@vue/reactivity';
import {type ElementContext, type ElementEmits, type ElementProps} from '../types';
import {generateFieldId} from './generateFieldId';

export const useElementContext = <
  T1 = unknown,
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
