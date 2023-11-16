import {get, isDefined} from '@vueuse/core';
import {type ElementInstance} from '@myparcel-do/shared';
import {useElement} from '@myparcel/vue-form-builder';

export const useElInputClasses = (element?: ElementInstance): string[] => {
  const resolvedElement = element ?? useElement();

  return [
    get(resolvedElement.isValid) ? 'border-gray-300' : 'border-red-500',
    get(resolvedElement.isDisabled) ? 'opacity-50 cursor-not-allowed' : undefined,
  ].filter(isDefined) as string[];
};
