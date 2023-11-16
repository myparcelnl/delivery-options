<template>
  <DeliveryMoment.Component />
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import RadioGroupInput from './form/RadioGroupInput.vue';

const options = ref<SelectOption[]>([]);

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = createField({
  name: 'deliveryMoment',
  component: RadioGroupInput,
  props: {
    // carrier: 'postnl',
    // price: 6.59,
    options,
  },
});
</script>
