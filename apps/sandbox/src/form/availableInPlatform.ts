import {useMemoize} from '@vueuse/core';
import {
  type ConfigKey,
  useLogger,
  CarrierSetting,
  type SupportedPlatformName,
} from '@myparcel-dev/do-shared';

const ALWAYS_ENABLED_FIELDS: readonly string[] = Object.freeze([CarrierSetting.AllowDeliveryOptions]);

/**
 * Check if a given field is enabled by name for the carrier.
 * With capabilities, all options are shown in the sandbox form and capabilities determines availability at runtime.
 */
export const availableInCarrier = useMemoize((fieldPath: string, _platformName?: SupportedPlatformName): boolean => {
  const logger = useLogger();

  const split = fieldPath?.split('.');
  const baseField = split?.pop() as ConfigKey;

  if (!baseField) {
    if (import.meta.env.DEV) logger.warning('Could not determine base field from', fieldPath);

    return false;
  }

  if (ALWAYS_ENABLED_FIELDS.includes(baseField)) {
    return true;
  }

  // With capabilities, all carrier options are available in the sandbox
  return true;
});
