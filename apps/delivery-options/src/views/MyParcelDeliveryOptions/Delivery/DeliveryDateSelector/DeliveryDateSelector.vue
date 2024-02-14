<template>
  <DeliveryDate.Component />
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_DELIVERY_DATE} from '../../../../data';
import DateSelector from './DateSelector.vue';

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = createField({
  name: FIELD_DELIVERY_DATE,
  component: DateSelector,
  ref: ref<null | string>(),
});
</script>
