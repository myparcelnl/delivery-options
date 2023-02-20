/* eslint-disable no-magic-numbers */
import * as ADDRESS from '@/data/keys/addressKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

/**
 * @type {Object<MyParcel.Platform, MyParcelDeliveryOptions.Address>}
 */
export const defaultAddress = {
  [MYPARCEL]: {
    [ADDRESS.CC]: countryCodes.NETHERLANDS,
    [ADDRESS.NUMBER]: 31,
    [ADDRESS.POSTAL_CODE]: '2132JE',
    [ADDRESS.STREET]: 'Antareslaan 31',
  },
  [SENDMYPARCEL]: {
    [ADDRESS.CC]: countryCodes.BELGIUM,
    [ADDRESS.CITY]: 'Antwerpen',
    [ADDRESS.NUMBER]: 16,
    [ADDRESS.STREET]: 'Adriaan Brouwerstraat 16',
    [ADDRESS.POSTAL_CODE]: '2000',
  },
};
