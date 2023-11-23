/* eslint-disable no-magic-numbers */

import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {PlatformName} from '@myparcel/constants';
import {type DeliveryOptionsAddress, type SupportedPlatformName} from '../../types';
import {AddressField} from '../../enums';

export const defaultAddress: Record<SupportedPlatformName, DeliveryOptionsAddress> = {
  [PlatformName.MyParcel]: {
    [AddressField.Cc]: NETHERLANDS,
    [AddressField.City]: 'Hoofddorp',
    [AddressField.PostalCode]: '2132JE',
    [AddressField.Street]: 'Antareslaan 31',
  },
  [PlatformName.SendMyParcel]: {
    [AddressField.Cc]: BELGIUM,
    [AddressField.City]: 'Antwerpen',
    [AddressField.PostalCode]: '2000',
    [AddressField.Street]: 'Adriaan Brouwerstraat 16',
  },
};
