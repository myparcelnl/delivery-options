<template>
  <DeliveryMoment.Component v-if="DeliveryMoment" />
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {ComponentName, type SelectOption} from '@myparcel-do/shared';
import {createField, type ModularCreatedField} from '@myparcel/vue-form-builder';
import {ShipmentOptionName} from '@myparcel/constants';
import {getComponent} from '../utils';
import {type ResolvedDeliveryOptions} from '../types';
import {FIELD_DELIVERY_MOMENT} from '../constants';
import {useSelectedDeliveryDate} from '../composables/useSelectedDeliveryDate';
import {useResolvedDeliveryMoments} from '../composables/useResolvedDeliveryMoments';

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = ref<ModularCreatedField | null>(null);

const deliveryMoments = useResolvedDeliveryMoments();
const deliveryDate = useSelectedDeliveryDate();

watch(deliveryDate, () => {
  if (!deliveryMoments.value.length) {
    return;
  }

  DeliveryMoment.value = createField({
    name: FIELD_DELIVERY_MOMENT,
    component: getComponent(ComponentName.RadioGroup),
    props: {
      options: deliveryMoments.value.map((option) => {
        const shipmentOptions = option.shipmentOptions.filter((option) => {
          return ([ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient] as const).includes(option.name);
        });

        return {
          carrier: option.carrier.identifier,
          label: option.time,
          value: {
            time: option.time,
            carrier: option.carrier.identifier,
            date: option.date,
            deliveryType: option.deliveryType,
            packageType: option.packageType,
            shipmentOptions,
          } satisfies ResolvedDeliveryOptions,
        };
      }) satisfies SelectOption[],
    },
  });
});
</script>
