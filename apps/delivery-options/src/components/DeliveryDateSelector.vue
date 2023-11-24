<template>
  <DeliveryDate.Component />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {ComponentName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getComponent} from '../utils';
import {useResolvedDeliveryDates} from '../composables';

const deliveryDates = useResolvedDeliveryDates();

const options = computed(() => {
  return deliveryDates.value.map((option) => ({
    label: option.date,
    value: option.date,
  }));
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: 'deliveryDate',
  label: 'deliveryDate',
  component: getComponent(ComponentName.Select),
  props: {
    loading: computed(() => !options.value.length),
    options,
  },
});
</script>
