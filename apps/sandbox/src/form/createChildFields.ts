import {isDefined} from '@vueuse/core';
import {ALL_OPTIONS} from '@myparcel-do/shared';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {createField} from './createField';

export const createChildFields = (group: SandboxOptionGroup): SettingsField[] => {
  const resolvedItems = (group.items ?? [])
    .map((item) => {
      return ALL_OPTIONS.find((option) => option.key === item);
    })
    .filter(isDefined) as ConfigOption[];

  return resolvedItems.map(createField);
};
