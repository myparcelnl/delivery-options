export enum AddressField {
  Cc = 'cc',
  City = 'city',
  Number = 'number',
  PostalCode = 'postalCode',
  Street = 'street',
}

interface BaseAddress {
  [AddressField.Cc]: string;
  [AddressField.City]: string;
  [AddressField.PostalCode]: string;
}

export interface DeliveryOptionsOldAddress extends BaseAddress {
  [AddressField.Number]: string;
}

export interface DeliveryOptionsAddress extends BaseAddress {
  [AddressField.Street]: string;
}

export interface ResolvedDeliveryOptionsAddress extends BaseAddress {
  [AddressField.Street]: string;
}
