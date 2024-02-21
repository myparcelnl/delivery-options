import {
  type CarrierIdentifier,
  type CarrierSettings,
  type CarrierSettingsKey,
  type DeliveryOptionsConfig,
  KEY_CARRIER_SETTINGS,
  type ConfigSetting,
} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

type ResolvedValue<T extends ConfigSetting | CarrierSettingsKey> = T extends ConfigSetting
  ? DeliveryOptionsConfig[T]
  : CarrierSettings[T];

export const getResolvedValue = <
  T extends ConfigSetting | CarrierSettingsKey,
  Default extends NonNullable<ResolvedValue<T>>,
>(
  key: T,
  carrierIdentifier?: CarrierIdentifier,
  defaultValue?: Default,
): Default extends any ? NonNullable<ResolvedValue<T>> | Default : ResolvedValue<T> => {
  const config = useConfigStore();

  const generalValue = config[key] ?? defaultValue;

  if (!carrierIdentifier) {
    // @ts-expect-error todo
    return generalValue;
  }

  // @ts-expect-error todo
  return config[KEY_CARRIER_SETTINGS]?.[carrierIdentifier]?.[key] ?? generalValue;
};
