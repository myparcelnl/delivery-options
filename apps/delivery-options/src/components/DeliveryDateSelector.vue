<template>
  <div v-if="DeliveryDate">
    <DeliveryDate.Label />

    <DeliveryDate.Component />
  </div>
</template>

<script lang="ts" setup>
import {ref, toRaw, watchEffect} from 'vue';
import {ComponentName} from '@myparcel-do/shared';
import {createField, type ModularCreatedField} from '@myparcel/vue-form-builder';
import {getComponent} from '../utils/getComponent';
import {useResolvedDeliveryDates} from '../composables/useResolvedDeliveryDates';

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryDate = ref<ModularCreatedField | null>(null);

const deliveryDates = useResolvedDeliveryDates();

watchEffect(() => {
  if (!deliveryDates.value) {
    return;
  }

  DeliveryDate.value = toRaw(
    createField({
      name: 'deliveryDate',
      label: 'deliveryDate',
      wrapper: false,
      component: getComponent(ComponentName.Select),
      props: {
        options: deliveryDates.value.map((option) => ({
          label: option.date,
          value: option.date,
        })),
      },
    }),
  );
});
</script>
