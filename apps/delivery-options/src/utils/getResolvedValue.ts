import {
  type CarrierIdentifier,
  type CarrierSettings,
  useCarrierSettings,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';

export const getResolvedValue = <T extends keyof CarrierSettings>(
  key: T,
  carrier?: CarrierIdentifier,
  defaultValue?: NonNullable<CarrierSettings[T]>,
): CarrierSettings[T] => {
  const store = useDeliveryOptionsStore();

  const generalValue = store.configuration?.config?.[key] ?? defaultValue;

  if (!carrier) {
    return generalValue;
  }

  const carrierSettings = useCarrierSettings(carrier);

  return carrierSettings.value?.[key] ?? generalValue;
};
