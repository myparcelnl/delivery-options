/* eslint-disable no-magic-numbers */

import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {PlatformName} from '@myparcel/constants';
import {AddressField, type DeliveryOptionsAddress, type SupportedPlatformName} from '../../types';

export const defaultAddress: Record<SupportedPlatformName, DeliveryOptionsAddress> = {
  [PlatformName.MyParcel as const]: {
    [AddressField.Cc]: NETHERLANDS,
    [AddressField.City]: 'Hoofddorp',
    [AddressField.PostalCode]: '2132JE',
    [AddressField.Street]: 'Antareslaan 31',
  },
  [PlatformName.SendMyParcel as const]: {
    [AddressField.Cc]: BELGIUM,
    [AddressField.City]: 'Antwerpen',
    [AddressField.PostalCode]: '2000',
    [AddressField.Street]: 'Adriaan Brouwerstraat 16',
  },
};
