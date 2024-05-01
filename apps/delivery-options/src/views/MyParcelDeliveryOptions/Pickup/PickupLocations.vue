<template>
  <div>
    <PickupLocationInput />

    <div class="mp-flex mp-mb-2">
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

const config = useConfigStore();

const locations = useResolvedPickupLocations();
const mode = ref<PickupLocationsView>(config.pickupLocationsDefaultView);

const {translate} = useLanguage();

const currentComponent = computed(() =>
  mode.value === PickupLocationsView.List ? PickupLocationListWrapper : PickupLocationMapWrapper,
);

const immediate = locations.value.length > 0;

const {pickupLocation: selectedPickupLocation} = useSelectedValues();

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
    },
    {immediate, deep: true},
  ),
);
</script>
