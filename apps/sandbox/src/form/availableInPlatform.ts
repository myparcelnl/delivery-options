import {toValue} from 'vue';
import {useMemoize, isDefined} from '@vueuse/core';
import {isEnumValue} from '@myparcel-dev/ts-utils';
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
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';

const ALWAYS_ENABLED_FIELDS: readonly string[] = Object.freeze([CarrierSetting.AllowDeliveryOptions]);

const isValidCarrier = (carrierIdentifier?: CarrierIdentifier): carrierIdentifier is CarrierIdentifier => {
  return isDefined(carrierIdentifier) && isEnumValue(resolveCarrierName(carrierIdentifier), CarrierName);
};

/**
 * Given a carrier, platform and field, returns whether the feature is enabled for that carrier.
 *
 * @param carrierIdentifier
 * @param platformName
 * @param field
 * @returns
 */
const featureIsEnabled = (
  carrierIdentifier: CarrierIdentifier,
  platformName: SupportedPlatformName,
  field: ConfigKey,
): boolean => {
  const {features} = useCarrier({carrierIdentifier, platformName});

  if (!toValue(features)?.size) {
    return false;
  }

  return toValue(features).has(field);
};

/**
 * Check if a given field is enabled by name for the carrier in the specified platform.
 * When a child field is given (dot notation in field name), the root-level field is checked.
 *
 * @param fieldPath the full nested path of the field in the config (e.g. postnl.allowFeatureX.priceFeatureX)
 */
export const availableInCarrier = useMemoize((fieldPath: string, platformName: SupportedPlatformName): boolean => {
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
