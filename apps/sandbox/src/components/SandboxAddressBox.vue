<template>
  <Box class="mp-gap-2 mp-grid">
    <AutoAnchor name="address">
      <h2 v-text="translate('address')" />
    </AutoAnchor>

    <div class="mp-gap-2 mp-grid mp-grid-cols-2">
      <AddressPresetBox
        v-for="address in sampleAddresses"
        :key="address"
        v-model="selectedAddress"
        :address="address" />
    </div>

    <Box @click="isCustom ? null : (selectedAddress = customValue)">
      <h3>
        <label>
          <RadioInput
            v-model="selectedAddress"
            :value="customValue"
            name="address" />

          {{ translate('address_custom') }}
        </label>
      </h3>

      <SandboxSettingsSection
        v-show="isCustom"
        :section="section" />
    </Box>
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {AddressField, KEY_ADDRESS, RadioInput} from '@myparcel-do/shared';
import {ALL_COUNTRIES} from '@myparcel/constants/countries';
import {translateCountry} from '../utils';
import {formField, formSection} from '../form';
import {useAddressSelector, useAvailableCarriers, useLanguage} from '../composables';
import {FormSelectInput, SandboxSettingsSection, FormTextInput} from './form';
import {Box} from './Box';
import AutoAnchor from './AutoAnchor.vue';
import AddressPresetBox from './AddressPresetBox.vue';

const availableCarriers = useAvailableCarriers();

const {translate} = useLanguage();

const {isCustom, sampleAddresses, selectedAddress, customValue} = useAddressSelector();

const countries = computed(() => {
  return ALL_COUNTRIES.filter((country) => {
    return availableCarriers.value?.some((carrier) => {
      return carrier.deliveryCountries.value.has(country) || carrier.pickupCountries.value.has(country);
    });
  })
    .map((country) => ({
      label: translateCountry(country),
      value: country,
    }))
    .sort((countryA, countryB) => countryA.label.localeCompare(countryB.label));
});

const LABEL_PREFIX = `${KEY_ADDRESS}_`;

const section = formSection({
  label: KEY_ADDRESS,
  fields: [
    formField({
      key: KEY_ADDRESS,
      name: AddressField.Country,
      label: LABEL_PREFIX + AddressField.Country,
      component: FormSelectInput,
      wrapper: false,
      props: {
        placeholder: translate('choose_date'),
        autocomplete: 'country',
        loading: computed(() => !countries.value.length),
        options: countries,
      },
    }),

    formField({
      key: KEY_ADDRESS,
      name: AddressField.Street,
      label: LABEL_PREFIX + AddressField.Street,
      component: FormTextInput,
      attributes: {
        autocomplete: 'address-line1',
      },
    }),

    formField({
      key: KEY_ADDRESS,
      name: AddressField.PostalCode,
      label: LABEL_PREFIX + AddressField.PostalCode,
      component: FormTextInput,
      attributes: {
        autocomplete: 'postal-code',
      },
    }),

    formField({
      key: KEY_ADDRESS,
      name: AddressField.City,
      label: LABEL_PREFIX + AddressField.City,
      component: FormTextInput,
      attributes: {
        autocomplete: 'address-level2',
      },
    }),
  ],
});
</script>
