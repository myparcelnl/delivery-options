import {isDefined} from '@vueuse/core';
import {useBaseInputClasses} from './useBaseInputClasses';

export const useElInputClasses = (): string[] => {
  return [
    ...useBaseInputClasses(),
    // Remove validation styling for now since we're not using vue-form-builder validation
    // Could be added back later with native validation
  ].filter(isDefined) as string[];
};
