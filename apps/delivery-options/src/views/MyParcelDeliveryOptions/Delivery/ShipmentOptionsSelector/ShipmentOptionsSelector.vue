<template>
  <GroupInputLoader
    v-show="loading"
    :rows="2"
    price>
    <RadioButtonLoader />
  </GroupInputLoader>

  <ShipmentOptions.Component v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_SHIPMENT_OPTIONS} from '../../../../data';
import {
  useShipmentOptionsOptions,
  useSelectedDeliveryMoment,
  useResolvedDeliveryMoments,
} from '../../../../composables';
import {GroupInputLoader, CheckboxGroupInput, RadioButtonLoader} from '../../../../components';

const deliveryMoments = useResolvedDeliveryMoments();
const deliveryMoment = useSelectedDeliveryMoment();

const loading = computed(() => !deliveryMoments.value.length || !deliveryMoment.value);

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShipmentOptions = createField({
  name: FIELD_SHIPMENT_OPTIONS,
  component: CheckboxGroupInput,
  ref: ref([]),
  props: {
    options: useShipmentOptionsOptions(),
  },
});
</script>
