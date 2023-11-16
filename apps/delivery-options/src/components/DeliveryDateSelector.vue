<template>
  <div>
    <DeliveryDate.Component />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import SelectInput from './form/SelectInput.vue';

const options = ref<SelectOption[]>([]);

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: 'deliveryDate',
  component: SelectInput,
  props: {
    options,
  },
});
</script>
