import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';

export const getConfigFromWindow = (): InputDeliveryOptionsConfiguration => {
  return window.MyParcelConfig ?? {};
};
