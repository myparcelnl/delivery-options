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
import {computed, toValue, watch} from 'vue';
import {type SelectOption} from '@myparcel-dev/do-shared';
import {FIELD_SHIPMENT_OPTIONS} from '../../../../data';
import {
  useShipmentOptionsOptions,
  useShipmentOptionRules,
  useFeatures,
  useResolvedDeliveryOptions,
  useSelectedValues,
} from '../../../../composables';
import {GroupInputLoader, CheckboxGroupInput, RadioButtonLoader} from '../../../../components';

const {shipmentOptions} = useSelectedValues();

const deliveryOptions = useResolvedDeliveryOptions();
const options = useShipmentOptionsOptions();
const {forcedOn, forcedOff, defaults} = useShipmentOptionRules();

const {availableShipmentOptions} = useFeatures();

const loading = computed(() => toValue(deliveryOptions.loading));

// Apply isSelectedByDefault options when no explicit selection has been made yet.
watch(defaults, (defaultOptions) => {
  if (shipmentOptions.value.length === 0 && defaultOptions.length > 0) {
    shipmentOptions.value = [...defaultOptions];
  }
}, {immediate: true});

// Enforce requires/excludes/isRequired rules on the selection state.
watch([forcedOn, forcedOff], ([on, off]) => {
  const current = new Set(shipmentOptions.value);
  let changed = false;

  for (const opt of on) {
    if (!current.has(opt)) {
      current.add(opt);
      changed = true;
    }
  }

  for (const opt of off) {
    if (current.has(opt)) {
      current.delete(opt);
      changed = true;
    }
  }

  if (changed) {
    shipmentOptions.value = [...current];
  }
}, {immediate: true});
</script>
