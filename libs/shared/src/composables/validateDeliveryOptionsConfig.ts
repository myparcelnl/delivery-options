import {type DeliveryOptionsConfiguration, type InputDeliveryOptionsConfiguration} from '../types';

export const validateDeliveryOptionsConfig = (
  config: InputDeliveryOptionsConfiguration,
): DeliveryOptionsConfiguration => {
  // todo validate config

  return config as DeliveryOptionsConfiguration;
};
