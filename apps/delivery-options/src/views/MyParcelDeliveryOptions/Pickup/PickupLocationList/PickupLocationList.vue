<template>
  <PickupListInput
    v-model="pickupLocation"
    :loading="loading"
    :options="options" />
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {type MakeRequired, type SelectOption} from '@myparcel-dev/do-shared';
import {useResolvedPickupLocations, useSelectedValues} from '../../../../composables';
import PickupListInput from './PickupListInput.vue';

const {locations} = useResolvedPickupLocations();

const {pickupLocation} = useSelectedValues();

const options = computed<MakeRequired<SelectOption<string>, 'carrier'>[]>(() => {
  return (toValue(locations.value) ?? []).map((option) => ({
    label: option.locationName,
    carrier: option.carrier,
    value: option.locationCode,
  }));
});

const loading = computed(() => !options.value.length);
</script>
