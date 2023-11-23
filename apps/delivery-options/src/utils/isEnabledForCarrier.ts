import {type CarrierSetting, type CarrierWithIdentifier, useDeliveryOptionsConfig} from '@myparcel-do/shared';

export const isEnabledForCarrier = (carrier: CarrierWithIdentifier, option: CarrierSetting): boolean => {
  const config = useDeliveryOptionsConfig();

  const globalValue = config.data.config?.[option] ?? false;
  const carrierValue = config.data.config?.carrierSettings?.[carrier]?.[option] ?? false;

  return carrierValue || (globalValue && !!carrierValue);
};
