import {toValue} from 'vue';
import {isDefined} from '@vueuse/core';
import {type CarrierIdentifier, type ConfigOption} from '@myparcel-dev/do-shared';
import {useCurrentPlatform} from '@myparcel-dev/delivery-options';
import {type SandboxOptionGroup, type SettingsField} from '../types';
import {getAllSandboxConfigOptions} from './getAllSandboxConfigOptions';
import {availableInCarrier} from './availableInPlatform';

export const createChildFields = (group: SandboxOptionGroup, carrierName: CarrierIdentifier): SettingsField[] => {
  const allOptions = [...getAllSandboxConfigOptions()];

  const resolvedItems = (group.items ?? [])
    .map((item) => allOptions.find((option) => option.key === item))
    // Add in a store binding to ease two-way data binding (v-model) in the form components
    .map((item) => {
      if (!item) {
        return item;
      }

      // Create a copy of the item before modifying it
      const itemCopy = {...item};
      itemCopy.storePath = `carrierSettings.${carrierName}.${item.key}`;
      return itemCopy;
    })
    .filter(isDefined)
    .filter(
      (item) => item && availableInCarrier(`${carrierName}.${item.key}`, toValue(useCurrentPlatform().name)),
    ) as ConfigOption[];

  return resolvedItems.reduce((acc, item) => {
    acc.push(item);

    // Adds related items to the root (e.g. extended price options for the sandbox)
    item.related?.forEach((relatedItem) => {
      const match = allOptions.find((option) => option.key === relatedItem.key);

      if (!match) {
        return;
      }

      // Create a copy of the match before modifying it
      const matchCopy = {...match};
      matchCopy.storePath = `carrierSettings.${carrierName}.${match.key}`;
      acc.push(matchCopy);
    });
    return acc;
  }, [] as SettingsField[]);
};
