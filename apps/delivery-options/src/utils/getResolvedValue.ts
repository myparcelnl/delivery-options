import {
  type CarrierIdentifier,
  type CarrierSettings,
  type CarrierSettingsKey,
  type ConfigKey,
  type DeliveryOptionsConfig,
} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

type ResolvedValue<T extends ConfigKey | CarrierSettingsKey> = T extends ConfigKey
  ? DeliveryOptionsConfig[T]
  : CarrierSettings[T];

export const getResolvedValue = <
  T extends ConfigKey | CarrierSettingsKey,
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
  return config.carrierSettings[carrierIdentifier]?.[key] ?? generalValue;
};
