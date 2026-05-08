<template>
  <PickupListInput
    v-model="pickupLocation"
    :loading="loading"
    :options="options" />
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {type MakeRequired, type SelectOption} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../../../../stores';
import {useResolvedPickupLocations, useSelectedValues} from '../../../../composables';
import PickupListInput from './PickupListInput.vue';

const {locations} = useResolvedPickupLocations();
const {state: config} = useConfigStore();
const {pickupLocation, carrier} = useSelectedValues();

const options = computed<MakeRequired<SelectOption<string>, 'carrier'>[]>(() => {
  const all = toValue(locations.value) ?? [];
  const filtered =
    config.compactView && carrier.value ? all.filter((location) => location.carrier === carrier.value) : all;

  return filtered.map((option) => ({
    label: option.locationName,
    carrier: option.carrier,
    value: option.locationCode,
  }));
});

const loading = computed(() => !options.value.length);
</script>
