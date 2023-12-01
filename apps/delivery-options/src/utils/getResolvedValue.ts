import {
  type CarrierIdentifier,
  type CarrierSetting,
  type CarrierSettings,
  type ConfigSetting,
} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

export const getResolvedValue = <T extends ConfigSetting | CarrierSetting>(
  key: T,
  carrierIdentifier?: CarrierIdentifier,
  defaultValue?: NonNullable<CarrierSettings[T]>,
): CarrierSettings[T] => {
  const config = useConfigStore();

  const generalValue = config[key] ?? defaultValue;

  if (!carrierIdentifier) {
    return generalValue;
  }

  return config.carrierSettings[carrierIdentifier]?.[key] ?? generalValue;
};
