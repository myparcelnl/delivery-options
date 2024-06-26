<template>
  <Box class="mp-gap-2 mp-grid">
    <h2 v-text="translate('address')" />

    <div class="mp-gap-2 mp-grid mp-grid-cols-2">
      <AddressPresetBox
        v-for="address in addresses"
        :key="address"
        v-model="selectedAddress"
        :address="address" />

      <a
        v-if="hasMore"
        class="mp-col-span-2 mp-mx-auto mp-place-self-center"
        href="#"
        @click.prevent="loadMore">
        {{ translate('more') }}
      </a>
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
import {createCountryTranslatable} from '../utils';
import {formField, formSection} from '../form';
import {useAddressSelector, useLanguage} from '../composables';
import {FormSelectInput, SandboxSettingsSection, FormTextInput} from './form';
import {Box} from './Box';
import AddressPresetBox from './AddressPresetBox.vue';

const {translate} = useLanguage();

const {isCustom, addresses, selectedAddress, customValue, hasMore, loadMore} = useAddressSelector();

const countries = computed(() => {
  return ALL_COUNTRIES.map((country) => ({
    label: createCountryTranslatable(country),
    value: country,
  })).sort((countryA, countryB) => countryA.label.localeCompare(countryB.label));
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
      attributes: {
        class: 'mp-mb-4',
      },
      props: {
        placeholder: 'choose_country',
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
