<template>
  <div>
    <PickupLocationInput />

    <div
      v-if="style === PickupLocationStyle.Default"
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
import {PickupLocationsView, PickupLocationStyle} from '@myparcel-do/shared';
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

const style = ref<PickupLocationStyle>(config.pickupLocationsStyle);
const mode = ref<PickupLocationsView>(config.pickupLocationsDefaultView);

const currentComponent = computed(() => {
  if (style.value === PickupLocationStyle.Map) {
    return PickupLocationMapWrapper;
  }

  if (style.value === PickupLocationStyle.List) {
    return PickupLocationListWrapper;
  }

  // Default behavior - use mode to determine component
  return mode.value === PickupLocationsView.List ? PickupLocationListWrapper : PickupLocationMapWrapper;
});

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

      const [firstLocation] = value;

      selectedPickupLocation.value = firstLocation.locationCode;
      carrier.value = firstLocation.carrier;
    },
    {immediate, deep: true},
  ),
);
</script>
