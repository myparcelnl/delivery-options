<template>
  <div>
    <PickupLocationInput />

    <div
      v-if="allowViewSelection"
      class="mp-flex mp-mb-2">
      <DoButton
        v-for="view in [PickupLocationsView.List, PickupLocationsView.Map]"
        :key="view"
        :active="mode === view"
        @click="mode = view">
        {{ translate(view) }}
      </DoButton>
    </div>

    <KeepAlive>
      <component :is="currentComponent" />
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch, onUnmounted} from 'vue';
import {PickupLocationsView} from '@myparcel-do/shared';
import {useConfigStore} from '../../../stores';
import {useLanguage, useResolvedPickupLocations, useSelectedValues, useActiveCarriers} from '../../../composables';
import {DoButton} from '../../../components';
import PickupLocationMapWrapper from './PickupLocationMap/PickupLocationMapWrapper.vue';
import PickupLocationListWrapper from './PickupLocationList/PickupLocationListWrapper.vue';
import PickupLocationInput from './PickupLocationInput/PickupLocationInput.vue';

const {locations} = useResolvedPickupLocations();

// Load pickup locations
void locations.load();

const {state: config} = useConfigStore();
const {translate} = useLanguage();

const allowViewSelection = ref<boolean>(config.allowPickupLocationsViewSelection);
const mode = ref<PickupLocationsView>(config.pickupLocationsDefaultView);

const currentComponent = computed(() =>
  mode.value === PickupLocationsView.List ? PickupLocationListWrapper : PickupLocationMapWrapper,
);

const immediate = locations.value.length > 0;

const {pickupLocation: selectedPickupLocation, carrier} = useSelectedValues();

// Clear the carries and locations memoize cache, otherwise reactivity issues may occur on mount with different config.
onUnmounted(() => {
  useActiveCarriers.clear();
  useResolvedPickupLocations.clear();
});

onUnmounted(
  watch(
    locations,
    (value) => {
      if (!value.length) {
        return;
      }

      // Try to preserve the previously selected pickup location
      const previousLocationCode = selectedPickupLocation.value;
      const previousCarrier = carrier.value;

      // First, try to find the exact same location (locationCode + carrier)
      let locationToSelect = value.find(
        (location) => location.locationCode === previousLocationCode && location.carrier === previousCarrier,
      );

      // If the exact location is not available, but we had a previously selected carrier,
      // try to find the first location for that carrier
      if (!locationToSelect && previousCarrier) {
        locationToSelect = value.find((location) => location.carrier === previousCarrier);
      }

      // Final fallback: use the first location in the list
      if (!locationToSelect) {
        locationToSelect = value[0];
      }

      selectedPickupLocation.value = locationToSelect.locationCode;
      carrier.value = locationToSelect.carrier;
    },
    {immediate, deep: true},
  ),
);
</script>
