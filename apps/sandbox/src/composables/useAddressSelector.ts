import {computed, onUnmounted, watch, type Ref, toValue, type ComputedRef} from 'vue';
import {useLocalStorage} from '@vueuse/core';
import {AddressField, type DeliveryOptionsAddress, KEY_ADDRESS, useLoadMore} from '@myparcel-dev/shared';
import {useForm} from '@myparcel-dev/vue-form-builder';
import {
  GERMANY,
  FRANCE,
  UNITED_KINGDOM,
  UNITED_STATES_OF_AMERICA,
  BELGIUM,
  NETHERLANDS,
  SWEDEN,
  DENMARK,
} from '@myparcel-dev/constants/countries';
import {getDefaultSandboxAddress} from '../config';

const ADDRESSES_START_AMOUNT = 6;
const ADDRESSES_LOAD_STEP = 2;

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
    [AddressField.PostalCode]: '10119',
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
  {
    [AddressField.Country]: SWEDEN,
    [AddressField.City]: 'Stockholm',
    [AddressField.PostalCode]: '111 29',
    [AddressField.Street]: 'Drottninggatan 1',
  },
  {
    [AddressField.Country]: DENMARK,
    [AddressField.City]: 'København',
    [AddressField.PostalCode]: '1577',
    [AddressField.Street]: 'Bernstorffsgade 7',
  },
]) satisfies readonly DeliveryOptionsAddress[];

interface UseAddressSelector {
  addresses: ComputedRef<DeliveryOptionsAddress[]>;
  customValue: typeof ADDRESS_TYPE_CUSTOM;
  hasMore: ComputedRef<boolean>;
  isCustom: ComputedRef<boolean>;
  selectedAddress: Ref<string>;

  loadMore(): void;
}

// eslint-disable-next-line max-lines-per-function
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

      Object.values(AddressField).forEach((key: AddressField) => {
        // @ts-expect-error todo
        form.values[`${KEY_ADDRESS}.${key}`] = matchingAddress?.[key];
      });
    }),
  );

  const {
    items: addresses,
    hasMore,
    loadMore,
  } = useLoadMore({
    items: sampleAddresses,
    step: ADDRESSES_LOAD_STEP,
    start: ADDRESSES_START_AMOUNT,
    isSelected: (item) => item[AddressField.Country] === toValue(selectedAddress),
  });

  return {
    addresses,
    customValue: ADDRESS_TYPE_CUSTOM,
    isCustom,
    selectedAddress,
    hasMore,
    loadMore,
  };
};
