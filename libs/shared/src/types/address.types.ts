import {type AddressField} from '../data';

interface BaseAddress {
  [AddressField.Country]: string;
  [AddressField.City]: string;
  [AddressField.PostalCode]: string;
}

export interface DeliveryOptionsAddress extends BaseAddress {
  [AddressField.Street]: string;
}
