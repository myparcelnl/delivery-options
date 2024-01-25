<template>
  <DeliveryDate.Component />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {CHOOSE_DATE} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_DELIVERY_DATE} from '../../../../data';
import {useDateFormat, useLanguage, useResolvedDeliveryDates} from '../../../../composables';
import DateSelector from './DateSelector.vue';

const {translate} = useLanguage();
const deliveryDates = useResolvedDeliveryDates();

const options = computed(() => {
  return deliveryDates.value.map((option) => {
    const date = useDateFormat(option.date);

    return {
      label: `${date.relative} (${date.standard})`,
      value: option.date,
    };
  });
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: FIELD_DELIVERY_DATE,
  component: DateSelector,
  ref: ref(),
  props: {
    options,
    placeholder: translate(CHOOSE_DATE),
  },
});
</script>
