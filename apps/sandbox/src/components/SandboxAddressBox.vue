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
import FormTextInput from './form/input/FormTextInput.vue';
import {FormSelectInput} from './form/input';
import SandboxSettingsSection from './form/SandboxSettingsSection.vue';
import {Box} from './Box';
import AutoAnchor from './AutoAnchor.vue';

// todo filter by carrier countries
const countries = computed(() => {
  return ALL_COUNTRIES.filter((country) => {
    return true;
  }).map((country) => ({
    label: country,
    value: country,
  }));
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

//
// // eslint-disable-next-line @typescript-eslint/naming-convention
// const Cc = createField({
//   label: AddressField.Country,
//   name: `${KEY_ADDRESS}.${AddressField.Country}`,
//   ref: ref(),
//   component: SelectInput,
//   props: {
//     autocomplete: 'country',
//     loading: computed(() => !countries.value.length),
//     options: countries,
//   },
// });
//
// // eslint-disable-next-line @typescript-eslint/naming-convention
// const Street = createField({
//   label: AddressField.Street,
//   name: `${KEY_ADDRESS}.${AddressField.Street}`,
//   ref: ref(),
//   component: FormTextInput,
//   attributes: {
//     autocomplete: 'address-line1',
//   },
// });
//
// // eslint-disable-next-line @typescript-eslint/naming-convention
// const PostalCode = createField({
//   label: AddressField.PostalCode,
//   name: `${KEY_ADDRESS}.${AddressField.PostalCode}`,
//   ref: ref(),
//   component: FormTextInput,
//   attributes: {
//     autocomplete: 'postal-code',
//   },
// });
//
// // eslint-disable-next-line @typescript-eslint/naming-convention
// const City = createField({
//   label: AddressField.City,
//   name: `${KEY_ADDRESS}.${AddressField.City}`,
//   ref: ref(),
//   component: FormTextInput,
//   attributes: {
//     autocomplete: 'address-level2',
//   },
// });
</script>
