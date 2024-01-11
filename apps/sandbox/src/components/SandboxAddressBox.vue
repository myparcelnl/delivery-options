<template>
  <Box>
    <AutoAnchor name="address">
      <h2>Address</h2>
    </AutoAnchor>

    <SandboxSettingsSection :section="section" />
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {AddressField, KEY_ADDRESS} from '@myparcel-do/shared';
import {ALL_COUNTRIES} from '@myparcel/constants/countries';
import {formField, formSection} from '../form';
import {useAvailableCarriers, useLanguage} from '../composables';
import FormTextInput from './form/input/FormTextInput.vue';
import {FormSelectInput} from './form/input';
import SandboxSettingsSection from './form/SandboxSettingsSection.vue';
import {Box} from './Box';
import AutoAnchor from './AutoAnchor.vue';

const allCarriers = useAvailableCarriers();

const {translate} = useLanguage();

const countries = computed(() => {
  return ALL_COUNTRIES.filter((country) => {
    return allCarriers.value?.some((carrier) => {
      return carrier.hasDeliveryInCountry(country) || carrier.hasPickupInCountry(country);
    });
  })
    .map((country) => ({
      label: translate(`country_${country.toLowerCase()}`),
      value: country,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const section = formSection({
  label: 'address',
  fields: [
    formField({
      key: KEY_ADDRESS,
      name: AddressField.Country,
      label: AddressField.Country,
      component: FormSelectInput,
      wrapper: false,
      props: {
        placeholder: AddressField.Country,
        autocomplete: 'country',
        loading: computed(() => !countries.value.length),
        options: countries,
      },
    }),

    formField({
      key: KEY_ADDRESS,
      name: AddressField.Street,
      label: AddressField.Street,
      component: FormTextInput,
      attributes: {
        autocomplete: 'address-line1',
      },
    }),

    formField({
      key: KEY_ADDRESS,
      name: AddressField.PostalCode,
      label: AddressField.PostalCode,
      component: FormTextInput,
      attributes: {
        autocomplete: 'postal-code',
      },
    }),

    formField({
      key: KEY_ADDRESS,
      name: AddressField.City,
      label: AddressField.City,
      component: FormTextInput,
      attributes: {
        autocomplete: 'address-level2',
      },
    }),
  ],
});
</script>
