<template>
  <PickupLocation.Component />
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {PickupLocationsView, type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useResolvedPickupLocations, useSelectedValues} from '../../../../composables';
import PickupListInput from './PickupListInput.vue';

const {locations} = useResolvedPickupLocations();

const {pickupLocation} = useSelectedValues();

const options = computed<SelectOption[]>(() => {
  return (toValue(locations.value) ?? []).map((option) => ({
    label: option.locationName,
    carrier: option.carrier,
    value: option.locationCode,
  }));
});

// watch(pickupLocation, (newLocation) => {
//   console.log('new location', newLocation);
//   // Find the carrier for the selected location
//   const selected = locations.value.find((loc) => loc.locationCode === newLocation);
//   carrier.value = selected?.carrier ?? undefined;
// });

// eslint-disable-next-line @typescript-eslint/naming-convention
const PickupLocation = createField({
  name: `${PickupLocationsView.List}_${FIELD_PICKUP_LOCATION}`,
  ref: pickupLocation,
  component: PickupListInput,
  props: {
    loading: computed(() => !options.value.length),
    options,
  },
});
</script>
