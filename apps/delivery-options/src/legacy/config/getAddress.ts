import {type DeliveryOptionsAddress} from '@myparcel-do/shared';
import {getWindowObject} from './getWindowObject';

/**
 * Use given address or get the address from the window object and convert cc to lowercase.
 */
export const getAddress = (address: DeliveryOptionsAddress): DeliveryOptionsAddress => {
  const newAddress = address || getWindowObject().address || {};

  if (newAddress.cc) {
    newAddress.cc = newAddress.cc.toUpperCase();
  }

  return newAddress;
};
