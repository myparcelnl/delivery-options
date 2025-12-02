import {type MaybeRef, toValue} from 'vue';
import {isDefined} from '@vueuse/core';
import {
  type ConfigOption,
  type BaseConfigOption,
  type SelectConfigOption,
  type SupportedPlatformName,
} from '@myparcel-dev/shared';
import {type InteractiveElementInstance} from '@myparcel-dev/vue-form-builder';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {useCurrentPlatform} from '../composables';
import {getAllSandboxConfigOptions} from './getAllSandboxConfigOptions';
import {createSandboxField} from './createSandboxField';
import {availableInCarrier} from './availableInPlatform';
import {allParentsHave} from './allParentsHave';

const isEnabled = (
  field: InteractiveElementInstance,
  platformName: MaybeRef<SupportedPlatformName>,
  match: BaseConfigOption | SelectConfigOption,
  prefix: string,
): boolean => {
  return availableInCarrier(field.name, toValue(platformName)) && allParentsHave(match.parents, field.form, prefix);
};

export const createChildFields = (group: SandboxOptionGroup, prefix: string): SettingsField[] => {
  const allOptions = getAllSandboxConfigOptions();
  const {name} = useCurrentPlatform();

  const resolvedItems = (group.items ?? [])
    .map((item) => allOptions.find((option) => option.key === item))
    .filter(isDefined) as ConfigOption[];

  return resolvedItems.reduce((acc, item) => {
    acc.push(
      createSandboxField(item, prefix, {
        visibleWhen(field: InteractiveElementInstance) {
          return isEnabled(field, name, item, prefix);
        },
      }),
    );

    item.related?.forEach((relatedItem) => {
      const match = allOptions.find((option) => option.key === relatedItem.key);

      if (!match) {
        return;
      }

      acc.push(
        createSandboxField(match, prefix, {
          visibleWhen(field: InteractiveElementInstance) {
            return isEnabled(field, name, match, prefix);
          },

          disabledWhen(field: InteractiveElementInstance) {
            return !isEnabled(field, name, match, prefix);
          },
        }),
      );
    });

    return acc;
  }, [] as SettingsField[]);
};
