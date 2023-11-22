import {type CarrierSetting, type DeliveryOptionsCarrier, useDeliveryOptionsConfig} from '@myparcel-do/shared';

export const isEnabledForCarrier = (carrier: DeliveryOptionsCarrier, option: CarrierSetting): boolean => {
  const config = useDeliveryOptionsConfig();

  const globalValue = config.data.config?.[option] ?? false;
  const carrierValue = config.data.config?.carrierSettings?.[carrier]?.[option] ?? false;

  return carrierValue || (globalValue && !!carrierValue);
};
