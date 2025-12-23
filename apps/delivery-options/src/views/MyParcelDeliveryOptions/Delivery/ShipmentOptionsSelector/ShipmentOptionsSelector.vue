<template>
  <GroupInputLoader
    v-show="loading && availableShipmentOptions.length"
    :rows="2"
    price>
    <template #input>
      <RadioButtonLoader />
    </template>
  </GroupInputLoader>

  <CheckboxGroupInput
    v-show="!loading && availableShipmentOptions.length"
    :id="FIELD_SHIPMENT_OPTIONS"
    v-model="shipmentOptions"
    :options="options as SelectOption<string>[]" />
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {type SelectOption} from '@myparcel-dev/do-shared';
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
</script>
