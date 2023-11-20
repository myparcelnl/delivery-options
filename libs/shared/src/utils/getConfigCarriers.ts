import {type CarrierObject} from '../types';
import {useDeliveryOptionsStore} from '../stores';
import {resolveCarrierName} from './resolveCarrierName';

export const getConfigCarriers = (): CarrierObject[] => {
  const store = useDeliveryOptionsStore();

  return Object.keys(store.configuration.config?.carrierSettings ?? {}).map((identifier) => ({
    identifier,
    name: resolveCarrierName(identifier),
  }));
};
