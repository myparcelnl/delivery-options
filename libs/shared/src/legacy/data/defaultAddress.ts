/* eslint-disable no-magic-numbers */
import * as ADDRESS from '@/data/keys/addressKeys';
import { BELGIUM, NETHERLANDS } from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';

/**
 * @type {Object<MyParcel.Platform, MyParcelDeliveryOptions.Address>}
 */
export const defaultAddress = {
  [MYPARCEL]: {
    [ADDRESS.CC]: NETHERLANDS,
    [ADDRESS.CITY]: 'Hoofddorp',
    [ADDRESS.POSTAL_CODE]: '2132JE',
    [ADDRESS.STREET]: 'Antareslaan 31',
  },
  [SENDMYPARCEL]: {
    [ADDRESS.CC]: BELGIUM,
    [ADDRESS.CITY]: 'Antwerpen',
    [ADDRESS.POSTAL_CODE]: '2000',
    [ADDRESS.STREET]: 'Adriaan Brouwerstraat 16',
  },
};
