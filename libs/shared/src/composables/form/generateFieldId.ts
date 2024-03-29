import {toValue} from 'vue';
import {type MaybeRef} from '@vueuse/core';
import {type ElementInstance} from '../../types';

export const generateFieldId = (element: MaybeRef<ElementInstance>): string => {
  const resolvedElement = toValue(element);
  const formBaseName = resolvedElement.form.name.split('--')[0];

  return `${formBaseName}--${resolvedElement.name}`;
};
