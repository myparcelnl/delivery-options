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
        @click="selectView(view)">
        {{ translate(view) }}
      </DoButton>
    </div>

    <div v-show="mode === PickupLocationsView.List">
      <PickupLocationListWrapper />
    </div>

    <div
      v-show="mode === PickupLocationsView.Map"
      class="mp-relative">
      <button
        v-if="config.popUpMap && !mapModalOpen"
        class="focus:mp-outline-none focus:mp-ring-2 focus:mp-ring-blue-500 hover:mp-bg-white md:mp-right-[calc(50%+0.5rem)] mp-absolute mp-bg-white/90 mp-border mp-border-gray-200 mp-cursor-pointer mp-px-3 mp-py-1.5 mp-right-2 mp-rounded-md mp-shadow-sm mp-text-sm mp-top-2 mp-transition-colors mp-z-[1000]"
        data-testid="pop-up-map-open"
        type="button"
        @click="mapModalOpen = true">
        {{ translate(POP_UP_MAP_OPEN) }}
      </button>

      <PickupLocationMapWrapper v-if="!config.popUpMap" />

      <Teleport
        v-if="config.popUpMap && modalMapTarget"
        :disabled="!isInModal"
        :to="modalMapTarget"
        defer>
        <PickupLocationMapWrapper :hide-details="isInModal" />
      </Teleport>
    </div>

    <PickupLocationMapModal
      v-if="config.popUpMap"
      :model-value="mapModalOpen"
      @update:modelValue="mapModalOpen = $event">
      <div
        ref="modalMapTarget"
        class="mp-h-full" />
    </PickupLocationMapModal>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch, onUnmounted} from 'vue';
import {PickupLocationsView, POP_UP_MAP_OPEN} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../../../stores';
import {
  useLanguage,
  usePickupLocationsMap,
  useResolvedPickupLocations,
  useSelectedValues,
  useActiveCarriers,
} from '../../../composables';
import {DoButton} from '../../../components';
import PickupLocationMapModal from './PickupLocationMapModal/PickupLocationMapModal.vue';
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
const mapModalOpen = ref<boolean>(config.popUpMap === true && mode.value === PickupLocationsView.Map);

const modalMapTarget = ref<HTMLElement>();

const isInModal = computed(
  () => config.popUpMap === true && mode.value === PickupLocationsView.Map && mapModalOpen.value,
);

const {map} = usePickupLocationsMap();

watch(isInModal, async () => {
  await nextTick();
  map.value?.invalidateSize();
});

function selectView(view: PickupLocationsView): void {
  mode.value = view;

  if (view === PickupLocationsView.Map && config.popUpMap === true) {
    mapModalOpen.value = true;
  } else if (view === PickupLocationsView.List) {
    mapModalOpen.value = false;
  }
}

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

      const preferred = carrier.value ? value.find((loc) => loc.carrier === carrier.value) : undefined;
      const firstLocation = preferred ?? value[0];

      if (!firstLocation) {
        return;
      }

      selectedPickupLocation.value = firstLocation.locationCode;
      carrier.value = firstLocation.carrier;
    },
    {immediate, deep: true},
  ),
);
</script>
