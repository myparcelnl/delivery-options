<template>
  <ShipmentOptions.Component v-if="ShipmentOptions" />
</template>

<script lang="ts" setup>
import {reactive, ref, toRaw, watch} from 'vue';
import {get, watchOnce} from '@vueuse/core';
import {ComponentName} from '@myparcel-do/shared';
import {createField, type ModularCreatedField} from '@myparcel/vue-form-builder';
import {createShipmentOptionsFromDeliveryMoment} from '../utils/createShipmentOptionsFromDeliveryMoment';
import {getComponent} from '../utils';
import {FIELD_DELIVERY_MOMENT, FIELD_SHIPMENT_OPTIONS} from '../constants';
import {useSelectedDeliveryMoment} from '../composables';

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShipmentOptions = ref<ModularCreatedField | null>(null);

const deliveryMoment = useSelectedDeliveryMoment();

watchOnce(deliveryMoment, () => {
  ShipmentOptions.value = createField({
    name: FIELD_SHIPMENT_OPTIONS,
    component: getComponent(ComponentName.CheckboxGroup),
    ref: ref([]),
    props: reactive({
      options: [],
    }),
  });

  watch(
    deliveryMoment,
    (moment) => {
      console.log(FIELD_DELIVERY_MOMENT, toRaw(moment));
      const newOptions = createShipmentOptionsFromDeliveryMoment(moment);

      const field = get(ShipmentOptions.value)?.field;

      if (!field) {
        return;
      }

      console.log('newOptions', newOptions);

      field.props.options = newOptions;
    },
    {deep: true},
  );
});
</script>
