import {isDefined} from '@vueuse/core';
import {
  type ConfigOption,
} from '@myparcel-dev/do-shared';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {getAllSandboxConfigOptions} from './getAllSandboxConfigOptions';

export const createChildFields = (group: SandboxOptionGroup, prefix: string): SettingsField[] => {
  const allOptions = getAllSandboxConfigOptions();

  const resolvedItems = (group.items ?? [])
    .map((item) => allOptions.find((option) => option.key === item))
    .filter(isDefined) as ConfigOption[];

  return resolvedItems.reduce((acc, item) => {
    acc.push(item);

    item.related?.forEach((relatedItem) => {
      const match = allOptions.find((option) => option.key === relatedItem.key);

      if (!match) {
        return;
      }

      acc.push(match);
    });

    return acc;
  }, [] as SettingsField[]);
};
