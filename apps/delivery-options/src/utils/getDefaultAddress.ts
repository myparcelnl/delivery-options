import {AddressField, type DeliveryOptionsAddress} from '@myparcel-dev/shared';

export const getDefaultAddress = (): DeliveryOptionsAddress => ({
  [AddressField.Country]: 'NL',
  [AddressField.City]: 'Hoofddorp',
  [AddressField.PostalCode]: '2132JE',
  [AddressField.Street]: 'Antareslaan 31',
});
