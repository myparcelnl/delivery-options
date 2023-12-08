<template>
  <OptionRowLoader
    v-show="loading"
    :rows="2"
    carrier
    price>
    <Loader.Circle class="mp-h-3 mp-w-3" />
  </OptionRowLoader>

  <DeliveryMoment.Component v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {ComponentName, Loader, type SelectOption, type SupportedShipmentOptionName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getComponent, getDeliveryTypePrice} from '../../../../utils';
import {FIELD_DELIVERY_MOMENT, SHOWN_SHIPMENT_OPTIONS} from '../../../../constants';
import {useResolvedDeliveryMoments} from '../../../../composables';
import OptionRowLoader from '../../../../components/common/OptionRow/OptionRowLoader.vue';

const deliveryMoments = useResolvedDeliveryMoments();

const loading = computed(() => !deliveryMoments.value.length);

const options = computed(() => {
  return deliveryMoments.value.map((option) => {
    return {
      carrier: option.carrier.identifier,
      label: option.time,
      price: getDeliveryTypePrice(option, option.carrier.identifier),
      value: JSON.stringify({
        time: option.time,
        carrier: option.carrier.identifier,
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
  component: getComponent(ComponentName.RadioGroup),
  ref: ref(),
  props: {
    options,
  },
});
</script>
