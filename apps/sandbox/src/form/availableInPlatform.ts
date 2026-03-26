import {useMemoize} from '@vueuse/core';
import {type SupportedPlatformName} from '@myparcel-dev/do-shared';

/**
 * Check if a given field is enabled by name for the carrier.
 * With capabilities, all options are shown in the sandbox form and capabilities determines availability at runtime.
 */
export const availableInCarrier = useMemoize((_fieldPath: string, _platformName?: SupportedPlatformName): boolean => {
  return true;
});
