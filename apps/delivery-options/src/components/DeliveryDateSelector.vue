<template>
  <div v-if="values.data">
    <DeliveryDate.Label />

    <DeliveryDate.Component />
  </div>
</template>

<script lang="ts" setup>
import {computed, markRaw} from 'vue';
import {get} from '@vueuse/core';
import {type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {useResolvedDeliveryOptions} from '../composables/useResolvedDeliveryOptions';
import SelectInput from './form/SelectInput.vue';

const values = useResolvedDeliveryOptions();

const options = computed<SelectOption[]>(() => {
  const data = get(values.data) ?? [];

  console.log(data);

  return data.map((option) => {
    return {
      label: option.date,
      value: option.date,
    };
  });
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: 'deliveryDate',
  label: 'deliveryDate',
  wrapper: false,
  component: markRaw(SelectInput),
  props: {
    options,
  },
});
</script>
