import {isDefined} from '@vueuse/core';
import {type ConfigOption, getAllOptions, type PlatformInstance, useCurrentPlatform} from '@myparcel-do/shared';
import {type FormInstance, type InteractiveElementInstance} from '@myparcel/vue-form-builder';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {createField} from './createField';

const allParentsHave = (parents: undefined | string[], form: FormInstance, prefix: string): boolean => {
  const parent = parents?.every((parent) => {
    const value = form.getValue(prefix ? `${prefix}.${parent}` : parent);

    return Boolean(value);
  });

  return Boolean(parent);
};

const availableInPlatform = (field: InteractiveElementInstance, platform: PlatformInstance): boolean => {
  const baseField = field.name?.split('.').pop();

  return Boolean(baseField && platform.features.value.has(baseField));
};

export const createChildFields = (group: SandboxOptionGroup, prefix: string): SettingsField[] => {
  const allOptions = getAllOptions();

  const platform = useCurrentPlatform();

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
          visibleWhen(field: InteractiveElementInstance) {
            return availableInPlatform(field, platform) && allParentsHave(match.parents, field.form, prefix);
          },

          disabledWhen(field: InteractiveElementInstance) {
            return !availableInPlatform(field, platform) || !allParentsHave(match.parents, field.form, prefix);
          },
        }),
      );
    });

    return acc;
  }, [] as SettingsField[]);
};
