import {computed, onUnmounted, watch, type Ref, toValue} from 'vue';
import {useLocalStorage} from '@vueuse/core';
import {AddressField, type DeliveryOptionsAddress, KEY_ADDRESS} from '@myparcel-do/shared';
import {useForm} from '@myparcel/vue-form-builder';
import {
  GERMANY,
  FRANCE,
  UNITED_KINGDOM,
  UNITED_STATES_OF_AMERICA,
  BELGIUM,
  NETHERLANDS,
} from '@myparcel/constants/countries';
import {getDefaultSandboxAddress} from '../config';

const KEY_ADDRESS_TYPE = 'addressType';
const ADDRESS_TYPE_CUSTOM = 'custom';

const sampleAddresses = Object.freeze([
  getDefaultSandboxAddress(),
  {
    [AddressField.Country]: BELGIUM,
    [AddressField.City]: 'Antwerpen',
    [AddressField.PostalCode]: '1000',
    [AddressField.Street]: 'Adriaan Brouwerstraat 16',
  },
  {
    [AddressField.Country]: GERMANY,
    [AddressField.City]: 'Berlin',
    [AddressField.PostalCode]: '10115',
    [AddressField.Street]: 'Torstraße 1',
  },
  {
    [AddressField.Country]: FRANCE,
    [AddressField.City]: 'Paris',
    [AddressField.PostalCode]: '75001',
    [AddressField.Street]: 'Rue de Rivoli 1',
  },
  {
    [AddressField.Country]: UNITED_KINGDOM,
    [AddressField.City]: 'London',
    [AddressField.PostalCode]: 'EC2A 4BX',
    [AddressField.Street]: 'Shoreditch High Street 1',
  },
  {
    [AddressField.Country]: UNITED_STATES_OF_AMERICA,
    [AddressField.City]: 'New York',
    [AddressField.PostalCode]: '10001',
    [AddressField.Street]: '5th Avenue 1',
  },
]) satisfies readonly DeliveryOptionsAddress[];

interface UseAddressSelector {
  customValue: typeof ADDRESS_TYPE_CUSTOM;
  isCustom: ReturnType<typeof computed>;
  sampleAddresses: typeof sampleAddresses;
  selectedAddress: Ref<string>;
}

export const useAddressSelector = (): UseAddressSelector => {
  const form = useForm();

  const selectedAddress = useLocalStorage(KEY_ADDRESS_TYPE, NETHERLANDS, {
    writeDefaults: true,
  });

  const isCustom = computed(() => toValue(selectedAddress) === ADDRESS_TYPE_CUSTOM);

  onUnmounted(
    watch(selectedAddress, (value) => {
      if (isCustom.value) {
        return;
      }

      const matchingAddress = sampleAddresses.find((address) => address[AddressField.Country] === value);

      const obj = Object.values(AddressField).reduce((acc, key: AddressField) => {
        // @ts-expect-error todo
        acc[`${KEY_ADDRESS}.${key}`] = matchingAddress?.[key];

        return acc;
      }, {} as Record<string, string>);

      form.setValues(obj);
    }),
  );

  return {
    selectedAddress,
    sampleAddresses,
    isCustom,
    customValue: ADDRESS_TYPE_CUSTOM,
  };
};
