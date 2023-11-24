import {isDefined} from '@vueuse/core';
import {type ConfigOption, getAllOptions} from '@myparcel-do/shared';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {createField} from './createField';

export const createChildFields = (group: SandboxOptionGroup, prefix: string): SettingsField[] => {
  const allOptions = getAllOptions();

  const resolvedItems = (group.items ?? [])
    .map((item) => allOptions.find((option) => option.key === item))
    .filter(isDefined) as ConfigOption[];

  return resolvedItems.reduce((acc, item) => {
    acc.push(createField(item, prefix));

    item.related?.forEach((relatedItem) => {
      const match = allOptions.find((option) => option.key === relatedItem.key);

      if (!match) {
        return;
      }

      acc.push(
        createField(match, prefix, {
          visibleWhen({form}) {
            const parent = match?.parents?.every((parent) => {
              const value = form.getValue(prefix ? `${prefix}.${parent}` : parent);

              return Boolean(value);
            });

            return Boolean(parent);
          },
        }),
      );
    });

    return acc;
  }, [] as SettingsField[]);
};
