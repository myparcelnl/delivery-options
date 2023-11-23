import {type AddressField} from '../enums';

interface BaseAddress {
  [AddressField.Cc]: string;
  [AddressField.City]: string;
  [AddressField.PostalCode]: string;
}

export interface DeliveryOptionsOldAddress extends BaseAddress {
  [AddressField.Number]: string | number;
}

export interface DeliveryOptionsAddress extends BaseAddress {
  [AddressField.Street]: string;
}

export interface ResolvedDeliveryOptionsAddress extends BaseAddress {
  [AddressField.Street]: string;
}
