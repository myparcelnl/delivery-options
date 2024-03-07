import {toValue} from 'vue';
import {useMemoize, isDefined} from '@vueuse/core';
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

const isValidCarrier = (carrierIdentifier?: CarrierIdentifier): carrierIdentifier is CarrierIdentifier => {
  return isDefined(carrierIdentifier) && isEnumValue(resolveCarrierName(carrierIdentifier), CarrierName);
};

const featureIsEnabled = (
  carrierIdentifier: CarrierIdentifier,
  platformName: SupportedPlatformName,
  field: ConfigKey,
): boolean => {
  const {features} = useCarrier({carrierIdentifier, platformName});

  const isEnabled = toValue(features).has(field);

  if (!isEnabled) {
    const options = getAllSandboxConfigOptions();
    const match = options.find((option) => option.key === field);

    return match?.parents?.some((parent) => toValue(features).has(parent)) ?? false;
  }

  return isEnabled;
};

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

  if (!isValidCarrier(carrierIdentifier)) {
    return true;
  }

  const {hasCarrier} = usePlatform(platformName);

  if (!hasCarrier(carrierIdentifier)) {
    return false;
  }

  return featureIsEnabled(carrierIdentifier, platformName, baseField);
});
