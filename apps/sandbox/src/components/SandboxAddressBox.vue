<template>
  <Box>
    <Cc.Component />

    <Street.Component />

    <PostalCode.Component />

    <City.Component />
  </Box>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {AddressField, KEY_ADDRESS, SelectInput} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {ALL_COUNTRIES} from '@myparcel/constants/countries';
import FormTextInput from './form/FormTextInput.vue';
import {Box} from './Box';

// todo filter by carrier countries
const countries = computed(() => {
  return ALL_COUNTRIES.filter((country) => {
    return true;
  }).map((country) => ({
    label: country,
    value: country,
  }));
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Cc = createField({
  label: AddressField.Cc,
  name: `${KEY_ADDRESS}.${AddressField.Cc}`,
  ref: ref(),
  component: SelectInput,
  props: {
    autocomplete: 'country',
    loading: computed(() => !countries.value.length),
    options: countries,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Street = createField({
  label: AddressField.Street,
  name: `${KEY_ADDRESS}.${AddressField.Street}`,
  ref: ref(),
  component: FormTextInput,
  attributes: {
    autocomplete: 'address-line1',
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const PostalCode = createField({
  label: AddressField.PostalCode,
  name: `${KEY_ADDRESS}.${AddressField.PostalCode}`,
  ref: ref(),
  component: FormTextInput,
  attributes: {
    autocomplete: 'postal-code',
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const City = createField({
  label: AddressField.City,
  name: `${KEY_ADDRESS}.${AddressField.City}`,
  ref: ref(),
  component: FormTextInput,
  attributes: {
    autocomplete: 'address-level2',
  },
});
</script>
