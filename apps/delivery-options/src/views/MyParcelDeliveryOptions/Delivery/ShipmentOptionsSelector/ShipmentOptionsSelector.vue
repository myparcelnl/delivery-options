<template>
  <GroupInputLoader
    v-show="loading && availableShipmentOptions.length"
    :rows="2"
    price>
    <template #input>
      <RadioButtonLoader />
    </template>
  </GroupInputLoader>

  <ShipmentOptions.Component v-show="!loading && availableShipmentOptions.length" />
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_SHIPMENT_OPTIONS} from '../../../../data';
import {
  useShipmentOptionsOptions,
  useFeatures,
  useResolvedDeliveryOptions,
  useSelectedValues,
} from '../../../../composables';
import {GroupInputLoader, CheckboxGroupInput, RadioButtonLoader} from '../../../../components';

const {shipmentOptions} = useSelectedValues();

const deliveryOptions = useResolvedDeliveryOptions();
const options = useShipmentOptionsOptions();

const {availableShipmentOptions} = useFeatures();

const loading = computed(() => toValue(deliveryOptions.loading));

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShipmentOptions = createField({
  name: FIELD_SHIPMENT_OPTIONS,
  component: CheckboxGroupInput,
  ref: shipmentOptions,
  props: {options},
});
</script>
