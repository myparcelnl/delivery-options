<template>
  <DeliveryMoment.Component v-if="DeliveryMoment" />
</template>

<script lang="ts" setup>
import {ref, watchEffect} from 'vue';
import {type SelectOption} from '@myparcel-do/shared';
import {createField, type ModularCreatedField} from '@myparcel/vue-form-builder';
import {useResolvedDeliveryOptions} from '../composables/useResolvedDeliveryOptions';
import RadioGroupInput from './form/RadioGroupInput.vue';

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = ref<ModularCreatedField | null>(null);

const deliveryMoments = useResolvedDeliveryOptions();

watchEffect(() => {
  if (!deliveryMoments.value) {
    return;
  }

  const options = deliveryMoments.value.map((option) => {
    return {
      carrier: option.carrier.identifier,
      label: option.time,
      value: option.time,
    };
  }) satisfies SelectOption[];

  DeliveryMoment.value = createField({
    name: 'deliveryMoment',
    component: RadioGroupInput,
    props: {
      options,
    },
  });
});
</script>
