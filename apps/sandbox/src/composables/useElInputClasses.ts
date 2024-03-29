import {toValue} from 'vue';
import {isDefined} from '@vueuse/core';
import {type ElementInstance} from '@myparcel-do/shared';
import {useElement} from '@myparcel/vue-form-builder';
import {useBaseInputClasses} from './useBaseInputClasses';

export const useElInputClasses = (element?: ElementInstance): string[] => {
  const resolvedElement = element ?? useElement();

  return [
    ...useBaseInputClasses(),
    toValue(resolvedElement.isValid) ? '' : 'mp-border-red-500',
    toValue(resolvedElement.isDisabled) ? 'mp-opacity-50 mp-cursor-not-allowed' : undefined,
  ].filter(isDefined) as string[];
};
