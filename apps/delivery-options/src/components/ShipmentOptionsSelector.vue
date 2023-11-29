<template>
  <ShipmentOptions.Component />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {ComponentName} from '@myparcel-do/shared';
import {createField, useForm} from '@myparcel/vue-form-builder';
import {createShipmentOptionsFromDeliveryMoment, getComponent} from '../utils';
import {FIELD_SHIPMENT_OPTIONS} from '../constants';
import {useSelectedDeliveryMoment} from '../composables';

const deliveryMoment = useSelectedDeliveryMoment();

const form = useForm();

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShipmentOptions = createField({
  name: FIELD_SHIPMENT_OPTIONS,
  component: getComponent(ComponentName.CheckboxGroup),
  ref: ref([]),
  props: {
    options: computed(() => {
      if (!deliveryMoment.value) {
        return [];
      }

      return createShipmentOptionsFromDeliveryMoment(deliveryMoment.value);
    }),
  },
});
</script>
