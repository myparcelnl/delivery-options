import {defineStore} from 'pinia';
import {AddressField, type DeliveryOptionsAddress} from '@myparcel-do/shared';

export const useAddressStore = defineStore('address', {
  state: (): DeliveryOptionsAddress => {
    return {
      [AddressField.Country]: '',
      [AddressField.City]: '',
      [AddressField.Street]: '',
      [AddressField.PostalCode]: '',
    };
  },
  actions: {
    update(address: DeliveryOptionsAddress): void {
      this.$patch(address);
    },
  },
});
