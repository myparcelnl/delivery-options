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
  useShipmentOptionsState,
  useFeatures,
  useResolvedDeliveryOptions,
  useSelectedValues,
} from '../../../../composables';
import {GroupInputLoader, CheckboxGroupInput, RadioButtonLoader} from '../../../../components';

const {shipmentOptions: pickedOptions} = useSelectedValues();

const deliveryOptions = useResolvedDeliveryOptions();
const options = useShipmentOptionsOptions();
const {forcedOn, defaults, selection} = useShipmentOptionsState();

const {availableShipmentOptions} = useFeatures();

const loading = computed(() => toValue(deliveryOptions.loading));

// The checkboxes show the resolved selection, while a click stores the consumer's own picks.
// Forced options are left out of what gets stored, so they are gone as soon as they stop being
// forced instead of lingering as if the consumer had chosen them.
const shipmentOptions = computed({
  get: () => selection.value,
  set: (picked: string[]) => {
    pickedOptions.value = picked.filter((option) => !forcedOn.value.has(option));
  },
});

// Apply isSelectedByDefault options when no explicit selection has been made yet.
watch(
  defaults,
  (defaultOptions) => {
    if (pickedOptions.value.length === 0 && defaultOptions.length > 0) {
      pickedOptions.value = [...defaultOptions];
    }
  },
  {immediate: true},
);
</script>
