<template>
  <DeliveryMoment.Component />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {ComponentName, type SelectOption, type SupportedShipmentOptionName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getDeliveryTypePrice} from '../utils/getDeliveryTypePrice';
import {getComponent} from '../utils';
import {FIELD_DELIVERY_MOMENT, SHOWN_SHIPMENT_OPTIONS} from '../constants';
import {useResolvedDeliveryMoments} from '../composables/useResolvedDeliveryMoments';

const deliveryMoments = useResolvedDeliveryMoments();

const options = computed(() => {
  return deliveryMoments.value.map((option) => {
    return {
      carrier: option.carrier.identifier,
      label: option.time,
      price: getDeliveryTypePrice(option, option.carrier.identifier),
      value: {
        time: option.time,
        carrier: option.carrier.identifier,
        date: option.date,
        deliveryType: option.deliveryType,
        packageType: option.packageType,
        shipmentOptions: option.shipmentOptions.filter((option) =>
          SHOWN_SHIPMENT_OPTIONS.includes(option.name as SupportedShipmentOptionName),
        ),
      },
    };
  }) satisfies SelectOption[];
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = createField({
  name: FIELD_DELIVERY_MOMENT,
  component: getComponent(ComponentName.RadioGroup),
  ref: ref(),
  props: {
    options,
  },
});
</script>
