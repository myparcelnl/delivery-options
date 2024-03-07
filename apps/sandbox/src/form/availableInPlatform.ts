import {toValue} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type ConfigKey,
  useLogger,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  useCarrier,
  resolveCarrierName,
  type CarrierIdentifier,
  type SupportedPlatformName,
  usePlatform,
} from '@myparcel-do/shared';
import {isEnumValue} from '@myparcel/ts-utils';
import {CarrierName} from '@myparcel/constants';
import {getAllSandboxConfigOptions} from './getAllSandboxConfigOptions';

const ALWAYS_ENABLED_FIELDS: readonly string[] = Object.freeze([CarrierSetting.AllowDeliveryOptions]);

export const availableInCarrier = useMemoize((fieldName: string, platformName: SupportedPlatformName): boolean => {
  const logger = useLogger();

  const split = fieldName?.split('.');
  const baseField = split?.pop() as ConfigKey;

  if (!baseField) {
    if (import.meta.env.DEV) logger.warning('Could not determine base field from', fieldName);

    return false;
  }

  if (ALWAYS_ENABLED_FIELDS.includes(baseField)) {
    return true;
  }

  const carrierIdentifier = split?.[split.indexOf(KEY_CARRIER_SETTINGS) + 1] as CarrierIdentifier | undefined;

  if (!carrierIdentifier || !isEnumValue(resolveCarrierName(carrierIdentifier), CarrierName)) {
    return true;
  }

  const {hasCarrier} = usePlatform(platformName);

  if (!hasCarrier(carrierIdentifier)) {
    return false;
  }

  const {features} = useCarrier({carrierIdentifier, platformName});

  const isEnabled = toValue(features).has(baseField);

  if (!isEnabled) {
    const options = getAllSandboxConfigOptions();
    const match = options.find((option) => option.key === baseField);

    return match?.parents?.some((parent) => toValue(features).has(parent)) ?? false;
  }

  return isEnabled;
});
