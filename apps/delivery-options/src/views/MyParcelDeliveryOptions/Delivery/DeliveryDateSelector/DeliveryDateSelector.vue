<template>
  <DeliveryDate.Component v-show="showDeliveryDate" />
</template>

<script lang="ts" setup>
import {createField} from '@myparcel-dev/vue-form-builder';
import {FIELD_DELIVERY_DATE} from '../../../../data';
import {useFeatures, useSelectedValues} from '../../../../composables';
import DateSelector from './DateSelector.vue';

const {deliveryDate} = useSelectedValues();

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: FIELD_DELIVERY_DATE,
  component: DateSelector,
  ref: deliveryDate,
});

const {showDeliveryDate} = useFeatures();
</script>
