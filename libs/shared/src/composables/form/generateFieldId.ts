import {unref} from 'vue';
import {type MaybeRef} from '@vueuse/core';
import {useElement} from '@myparcel/vue-form-builder';
import {type ElementInstance} from '../../types';

export const generateFieldId = (element?: MaybeRef<ElementInstance>): string => {
  const resolvedElement = unref(element) ?? useElement();

  const formBaseName = resolvedElement.form.name.split('--')[0];

  return `${formBaseName}--${resolvedElement.name ?? '?'}`;
};
