import {type DeliveryOptionsStore} from '.';
import {reactive} from 'vue';
import {AddressField, type DeliveryOptionsAddress} from '@myparcel-do/shared';

const initialState = {
  [AddressField.Country]: '',
  [AddressField.City]: '',
  [AddressField.Street]: '',
  [AddressField.PostalCode]: '',
};

const state = reactive<DeliveryOptionsAddress>({...initialState});

function update(address: DeliveryOptionsAddress): void {
  Object.assign(state, address);
}

// Reset to the initial state
function reset(): void {
  Object.assign(state, initialState);
}

export const useAddressStore = (): DeliveryOptionsStore<DeliveryOptionsAddress> => {
  return {
    state,
    update,
    reset,
  };
};
