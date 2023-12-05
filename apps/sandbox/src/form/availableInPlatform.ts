import {get} from '@vueuse/core';
import {type AnyConfigKey, getAllConfigOptions, useLogger} from '@myparcel-do/shared';
import {type InteractiveElementInstance} from '@myparcel/vue-form-builder';
import {type SandboxPlatformInstance} from '../composables';

export const availableInPlatform = (field: InteractiveElementInstance, platform: SandboxPlatformInstance): boolean => {
  const logger = useLogger();

  const baseField = field.name?.split('.').pop() as AnyConfigKey;

  if (!baseField) {
    logger.warning('Could not determine base field from', field.name);
    return false;
  }

  const isEnabled = get(platform.features).has(baseField);

  if (!isEnabled) {
    const options = getAllConfigOptions();
    const match = options.find((option) => option.key === baseField);

    return match?.parents?.some((parent) => get(platform.features).has(parent)) ?? false;
  }

  return isEnabled;
};
