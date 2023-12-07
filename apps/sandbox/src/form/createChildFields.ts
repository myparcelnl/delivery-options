import {isDefined} from '@vueuse/core';
import {type ConfigOption, getAllConfigOptions} from '@myparcel-do/shared';
import {type InteractiveElementInstance} from '@myparcel/vue-form-builder';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {useCurrentPlatform} from '../composables';
import {createField} from './createField';
import {availableInPlatform} from './availableInPlatform';
import {allParentsHave} from './allParentsHave';

export const createChildFields = (group: SandboxOptionGroup, prefix: string): SettingsField[] => {
  const allOptions = getAllConfigOptions();
  const platform = useCurrentPlatform();

  const resolvedItems = (group.items ?? [])
    .map((item) => allOptions.find((option) => option.key === item))
    .filter(isDefined) as ConfigOption[];

  return resolvedItems.reduce((acc, item) => {
    acc.push(
      createField(item, prefix, {
        visibleWhen(field: InteractiveElementInstance) {
          return availableInPlatform(field, platform) && allParentsHave(item.parents, field.form, prefix);
        },
      }),
    );

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
