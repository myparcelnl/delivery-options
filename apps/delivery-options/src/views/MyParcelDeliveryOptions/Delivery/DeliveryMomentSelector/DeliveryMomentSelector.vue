<template>
  <DeliveryMoment.Component v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {type SelectOption, type SupportedShipmentOptionName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getDeliveryTypePrice} from '../../../../utils';
import {FIELD_DELIVERY_MOMENT, SHOWN_SHIPMENT_OPTIONS} from '../../../../data';
import {useResolvedDeliveryMoments} from '../../../../composables';
import DeliveryMomentInput from './DeliveryMomentInput.vue';

const deliveryMoments = useResolvedDeliveryMoments();

const loading = computed(() => !deliveryMoments.value.length);

const options = computed(() => {
  return deliveryMoments.value.map((option) => {
    return {
      carrier: option.carrier,
      label: option.time,
      price: getDeliveryTypePrice(option, option.carrier),
      value: JSON.stringify({
        time: option.time,
        carrier: option.carrier,
        date: option.date,
        deliveryType: option.deliveryType,
        packageType: option.packageType,
        shipmentOptions: option.shipmentOptions.filter((option) =>
          SHOWN_SHIPMENT_OPTIONS.includes(option.name as SupportedShipmentOptionName),
        ),
      }),
    };
  }) satisfies SelectOption[];
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = createField({
  name: FIELD_DELIVERY_MOMENT,
  component: DeliveryMomentInput,
  ref: ref(),
  props: {
    options,
  },
});
</script>
