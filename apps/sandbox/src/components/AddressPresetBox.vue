<template>
  <Box
    is="label"
    :class="{
      'mp-bg-monstera-100 mp-border-monstera-200 dark:mp-bg-monstera-800 dark:mp-border-monstera-600':
        model === address[AddressField.Country],
    }">
    <h3>
      <RadioInput
        v-model="model"
        :value="address[AddressField.Country]"
        name="address" />

      {{ translate(createCountryTranslatable(address[AddressField.Country])) }}
    </h3>

    <p v-text="address[AddressField.Street]" />

    <p v-text="`${address[AddressField.PostalCode]} ${address[AddressField.City]}`"></p>
  </Box>
</template>

<script lang="ts" setup>
import {useModel} from 'vue';
import {type DeliveryOptionsAddress, AddressField, RadioInput} from '@myparcel-dev/shared';
import {createCountryTranslatable} from '../utils';
import {useLanguage} from '../composables';
import {Box} from './Box';

const props = defineProps<{
  address: DeliveryOptionsAddress;
  // eslint-disable-next-line vue/no-unused-properties
  modelValue?: string;
}>();

const model = useModel(props, 'modelValue');
const {translate} = useLanguage();
</script>
