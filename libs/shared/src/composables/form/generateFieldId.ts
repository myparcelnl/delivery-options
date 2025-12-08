import {toValue} from 'vue';
import {type MaybeRef} from '@vueuse/core';
import {type ElementInstance} from '../../types';

export const generateFieldId = (element: MaybeRef<ElementInstance>): string => {
  const resolvedElement = toValue(element);
  const formName = resolvedElement.form?.name ?? 'form';
  const formBaseName = formName.split('--')[0];

  return `${formBaseName}--${resolvedElement.name}`;
};
