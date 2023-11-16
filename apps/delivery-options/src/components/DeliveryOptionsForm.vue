<template>
  <Form.Component>
    <HomeDelivery />

    <PickupLocations />
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, watch} from 'vue';
import {type DeliveryOptionsOutput} from '@myparcel-do/shared';
import {createDeliveryOptionsForm} from '../form/createDeliveryOptionsForm';
import PickupLocations from './PickupLocations.vue';
import HomeDelivery from './HomeDelivery.vue';

const emit = defineEmits<(event: 'update', values: DeliveryOptionsOutput) => void>();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createDeliveryOptionsForm();

const values = computed<DeliveryOptionsOutput>(() => {
  return Form.instance?.getValues();
});

watch(values, (values) => {
  emit('update', values);
});
</script>
