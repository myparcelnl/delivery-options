/* eslint-disable no-magic-numbers */
import * as ADDRESS from '@/data/keys/addressKeys';
import * as countryCodes from '@/data/keys/countryCodes';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';

/**
 * @type {object<MyParcelDeliveryOptions.Address>}
 */
export const defaultAddress = {
  [MYPARCEL]: {
    [ADDRESS.CC]: countryCodes.CC_NL,
    [ADDRESS.NUMBER]: 31,
    [ADDRESS.POSTAL_CODE]: '2132JE',
  },
  [SENDMYPARCEL]: {
    [ADDRESS.CC]: countryCodes.CC_BE,
    [ADDRESS.CITY]: 'Antwerpen',
    [ADDRESS.NUMBER]: 16,
    [ADDRESS.POSTAL_CODE]: '2000',
  },
};
