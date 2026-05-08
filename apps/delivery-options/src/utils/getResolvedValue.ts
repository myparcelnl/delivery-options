import {
  type CarrierIdentifier,
  type CarrierSettings,
  type CarrierSettingsKey,
  type DeliveryOptionsConfig,
  KEY_CARRIER_SETTINGS,
  type ConfigKey,
} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';

type ResolvedValue<T extends ConfigKey> = T extends keyof DeliveryOptionsConfig
  ? DeliveryOptionsConfig[T]
  : T extends CarrierSettingsKey
  ? CarrierSettings[T]
  : unknown;

export const getResolvedValue = <T extends ConfigKey, Default extends NonNullable<ResolvedValue<T>>>(
  key: T,
  carrierIdentifier?: CarrierIdentifier,
  defaultValue?: Default,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Default extends any ? NonNullable<ResolvedValue<T>> | Default : ResolvedValue<T> => {
  const {state: config} = useConfigStore();

  // @ts-expect-error ConfigKey includes PackageTypeName which isn't a direct key of ResolvedDeliveryOptionsConfig
  const generalValue = config[key] ?? defaultValue;

  if (!carrierIdentifier) {
    return generalValue;
  }

  // @ts-expect-error todo
  return config[KEY_CARRIER_SETTINGS]?.[carrierIdentifier]?.[key] ?? generalValue;
};
