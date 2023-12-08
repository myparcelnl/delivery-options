import {
  type CarrierIdentifier,
  type CarrierSettings,
  type CarrierSettingsKey,
  type ConfigKey,
  type DeliveryOptionsConfig,
} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

export const getResolvedValue = <T extends ConfigKey | CarrierSettingsKey>(
  key: T,
  carrierIdentifier?: CarrierIdentifier,
  defaultValue?: NonNullable<T extends ConfigKey ? DeliveryOptionsConfig[T] : CarrierSettings[T]>,
): T extends ConfigKey ? DeliveryOptionsConfig[T] : CarrierSettings[T] => {
  const config = useConfigStore();

  const generalValue = config[key] ?? defaultValue;

  if (!carrierIdentifier) {
    return generalValue;
  }

  return config.carrierSettings[carrierIdentifier]?.[key] ?? generalValue;
};
