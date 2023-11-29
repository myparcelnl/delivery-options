<template>
  <DeliveryDate.Component />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {ComponentName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getComponent} from '../utils';
import {FIELD_DELIVERY_DATE} from '../constants';
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
  name: FIELD_DELIVERY_DATE,
  component: getComponent(ComponentName.Select),
  ref: ref(),
  props: {
    loading: computed(() => !options.value.length),
    options,
  },
});
</script>
