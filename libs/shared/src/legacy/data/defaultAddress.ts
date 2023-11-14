/* eslint-disable no-magic-numbers */

import {type DeliveryOptionsAddress, MYPARCEL, SENDMYPARCEL, type SupportedPlatformName} from '@myparcel-do/shared';
import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {ADDRESS_CC, ADDRESS_CITY, ADDRESS_POSTAL_CODE, ADDRESS_STREET} from './keys';

export const defaultAddress: Record<SupportedPlatformName, DeliveryOptionsAddress> = {
  [MYPARCEL]: {
    [ADDRESS_CC]: NETHERLANDS,
    [ADDRESS_CITY]: 'Hoofddorp',
    [ADDRESS_POSTAL_CODE]: '2132JE',
    [ADDRESS_STREET]: 'Antareslaan 31',
  },
  [SENDMYPARCEL]: {
    [ADDRESS_CC]: BELGIUM,
    [ADDRESS_CITY]: 'Antwerpen',
    [ADDRESS_POSTAL_CODE]: '2000',
    [ADDRESS_STREET]: 'Adriaan Brouwerstraat 16',
  },
};
