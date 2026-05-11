<template>
  <div
    :class="{
      'mp-flex-row': md && !hideDetails,
      'mp-flex-col': !md && !hideDetails,
      'mp-h-full': hideDetails,
    }"
    class="mp-border mp-flex mp-overflow-hidden mp-relative mp-rounded-2xl">
    <LeafletMap
      :class="{
        'mp-h-[400px]': md && !hideDetails,
        'mp-h-[300px]': !md && !hideDetails,
        'mp-w-1/2': md && !hideDetails,
        'mp-w-full': !md && !hideDetails,
        'mp-h-full mp-w-full': hideDetails,
      }">
      <Suspense>
        <template #default>
          <PickupLocationMapMarker
            v-for="location in visibleLocations"
            :key="location.locationCode"
            :active="locationCode === location.locationCode"
            :carrier-identifier="location.carrier"
            :location-code="location.locationCode" />
        </template>
      </Suspense>
    </LeafletMap>

    <div
      v-if="!hideDetails"
      :class="{
        'mp-border-l mp-w-1/2': md,
        'mp-border-t': !md,
      }"
      class="mp-flex-grow mp-p-5">
      <PickupLocationDetails
        v-if="selectedValues.pickupLocation.value && selectedValues.carrier.value"
        :carrier-identifier="selectedValues.carrier.value"
        :location-code="selectedValues.pickupLocation.value"
        expanded />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onUnmounted, watch} from 'vue';
import PickupLocationMapMarker from '../PickupLocationMapMarker/PickupLocationMapMarker.vue';
import {useAddressStore, useConfigStore} from '../../../../stores';
import {
  useBreakpoints,
  useResolvedPickupLocations,
  useSelectedPickupLocation,
  useSelectedValues,
} from '../../../../composables';
import {LeafletMap} from '../../../../components';
import PickupLocationDetails from './PickupLocationDetails.vue';

withDefaults(defineProps<{hideDetails?: boolean}>(), {hideDetails: false});

const {locations, reset} = useResolvedPickupLocations();
const addressStore = useAddressStore();
const {state: config} = useConfigStore();
const {locationCode} = useSelectedPickupLocation();
const {md} = useBreakpoints();
const selectedValues = useSelectedValues();

const visibleLocations = computed(() => {
  if (config.compactView && selectedValues.carrier.value) {
    const selected = selectedValues.carrier.value;
    return locations.value.filter((location) => location.carrier === selected);
  }

  return locations.value;
});

/**
 * When the address changes, reset the pickup locations array and selected pickup location.
 */
const removeAddressHook = () => {
  reset();

  selectedValues.pickupLocation.value = undefined;
  selectedValues.carrier.value = undefined;
};

watch(addressStore.state, removeAddressHook);

onUnmounted(removeAddressHook);
</script>
