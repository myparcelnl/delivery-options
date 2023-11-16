<template>
  <Form.Component>
    <HomeDelivery />

    <PickupLocations />
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, watch} from 'vue';
import {type DeliveryOptionsOutput, useDeliveryOptionsConfig} from '@myparcel-do/shared';
import {createForm} from '@myparcel/vue-form-builder';
import PickupLocations from './PickupLocations.vue';
import HomeDelivery from './HomeDelivery.vue';

const emit = defineEmits<(event: 'update', values: DeliveryOptionsOutput) => void>();

const config = useDeliveryOptionsConfig();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createForm('DeliveryOptions', {
  initialValues: config.value.initial ?? {},
});

const values = computed<DeliveryOptionsOutput>(() => {
  return Form.instance?.getValues();
});

watch(values, (values) => {
  console.log('emit');
  emit('update', values);
});
</script>
