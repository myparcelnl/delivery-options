<template>
  <GroupInputLoader
    v-show="loading"
    :rows="2"
    carrier
    price>
    <Loader.Circle class="mp-h-3 mp-w-3" />
  </GroupInputLoader>

  <DeliveryMoment.Component v-show="!loading">
    <template #default="{option}">
      <span v-text="option.label" />

      <EcoFriendlyLabel
        v-if="option.ecoFriendly"
        :amount="option.ecoFriendly" />

      <PriceTag
        v-if="option.price"
        :price="option.price"
        class="mp-ml-auto" />

      <CarrierLogo
        v-if="option.carrier"
        :carrier="option.carrier"
        :class="{
          'mp-ml-auto': !option.price,
        }" />
    </template>
  </DeliveryMoment.Component>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {CarrierLogo, Loader, type SelectOption, type SupportedShipmentOptionName} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getDeliveryTypePrice} from '../../../../utils';
import {FIELD_DELIVERY_MOMENT, SHOWN_SHIPMENT_OPTIONS} from '../../../../data';
import {useResolvedDeliveryMoments} from '../../../../composables';
import GroupInputLoader from '../../../../components/form/GroupInput/GroupInputLoader.vue';
import PriceTag from '../../../../components/common/PriceTag/PriceTag.vue';
import EcoFriendlyLabel from '../../../../components/common/EcoFriendlyLabel/EcoFriendlyLabel.vue';
import {RadioGroupInput} from '../../../../components';

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
  component: RadioGroupInput,
  ref: ref(),
  props: {
    options,
  },
});
</script>
