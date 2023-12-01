import {assign} from 'radash';
import {defineStore} from 'pinia';
import {AddressField, type DeliveryOptionsAddress} from '@myparcel-do/shared';

export const useAddressStore = defineStore('address', {
  state: (): DeliveryOptionsAddress => {
    return assign(
      {
        [AddressField.Cc]: '',
        [AddressField.City]: '',
        [AddressField.Street]: '',
        [AddressField.PostalCode]: '',
      },
      window.MyParcelConfig?.address ?? {},
    ) as DeliveryOptionsAddress;
  },
});
