<template>
  <DeliveryDate.Component />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {CHOOSE_DATE, ComponentName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getComponent} from '../../../../utils';
import {FIELD_DELIVERY_DATE} from '../../../../constants';
import {useDateFormat, useLanguage, useResolvedDeliveryDates} from '../../../../composables';

const {translate} = useLanguage();
const deliveryDates = useResolvedDeliveryDates();

const options = computed(() => {
  return deliveryDates.value.map((option) => {
    const date = useDateFormat(option.date);

    return {
      label: `${date.relative.value} (${date.standard.value})`,
      value: option.date,
    };
  });
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: FIELD_DELIVERY_DATE,
  component: getComponent(ComponentName.Select),
  ref: ref(),
  props: {
    loading: computed(() => !options.value.length),
    options,
    placeholder: translate(CHOOSE_DATE),
  },
});
</script>
