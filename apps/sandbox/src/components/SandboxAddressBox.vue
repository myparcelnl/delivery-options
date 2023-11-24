<template>
  <Box>
    <Cc.Component />

    <Street.Component />

    <PostalCode.Component />

    <City.Component />
  </Box>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {AddressField, KEY_ADDRESS, type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import FormTextInput from './form/FormTextInput.vue';
import FormSelectInput from './form/FormSelectInput.vue';
import {Box} from './Box';

const Cc = createField({
  label: AddressField.Cc,
  name: `${KEY_ADDRESS}.${AddressField.Cc}`,
  ref: ref(),
  component: FormSelectInput,
  props: {
    autocomplete: 'country',
    options: [
      {
        label: 'Netherlands',
        value: 'NL',
      },
    ] satisfies SelectOption[],
  },
});

const Street = createField({
  label: AddressField.Street,
  name: `${KEY_ADDRESS}.${AddressField.Street}`,
  ref: ref(),
  component: FormTextInput,
  attributes: {
    autocomplete: 'address-line1',
  },
});

const PostalCode = createField({
  label: AddressField.PostalCode,
  name: `${KEY_ADDRESS}.${AddressField.PostalCode}`,
  ref: ref(),
  component: FormTextInput,
  attributes: {
    autocomplete: 'postal-code',
  },
});

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
