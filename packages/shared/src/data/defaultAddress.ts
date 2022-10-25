/* eslint-disable no-magic-numbers */
import * as ADDRESS from '../data/keys/addressKeys';
import {COUNTRIES, PlatformName} from '@myparcel/sdk';
import {Address} from '../delivery-options.types';

/**
 * @type {object<MyParcelDeliveryOptions.Address>}
 */
export const defaultAddress: Record<PlatformName, Address> = {
  myparcel: {
    [ADDRESS.CC]: COUNTRIES.NETHERLANDS,
    [ADDRESS.NUMBER]: 68,
    [ADDRESS.POSTAL_CODE]: '2514GL',
  },
  flespakket: {
    [ADDRESS.CC]: COUNTRIES.NETHERLANDS,
    [ADDRESS.NUMBER]: 68,
    [ADDRESS.POSTAL_CODE]: '2514GL',
  },
  belgie: {
    [ADDRESS.CC]: COUNTRIES.BELGIUM,
    [ADDRESS.CITY]: 'Antwerpen',
    [ADDRESS.NUMBER]: 16,
    [ADDRESS.POSTAL_CODE]: '2000',
  },
};
