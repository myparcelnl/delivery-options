import {get, isDefined} from '@vueuse/core';
import {type ElementInstance} from '@myparcel-do/shared';
import {useElement} from '@myparcel/vue-form-builder';
import {useBaseInputClasses} from './useBaseInputClasses';

export const useElInputClasses = (element?: ElementInstance): string[] => {
  const resolvedElement = element ?? useElement();

  return [
    ...useBaseInputClasses(),
    get(resolvedElement.isValid) ? 'mp-border-gray-300' : 'mp-border-red-500',
    get(resolvedElement.isDisabled) ? 'mp-opacity-50 mp-cursor-not-allowed' : undefined,
  ].filter(isDefined) as string[];
};
