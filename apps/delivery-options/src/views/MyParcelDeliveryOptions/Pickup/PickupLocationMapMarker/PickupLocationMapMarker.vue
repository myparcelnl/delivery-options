<template>
  <LeafletMarker
    v-if="location?.carrier"
    v-bind="{active, center, options}"
    @click="onClick" />
</template>

<script lang="ts" setup>
import {computed, toRefs} from 'vue';
import {type MarkerOptions} from 'leaflet';
import {isDef} from '@vueuse/core';
import {createCarrierMarkerIcon} from '../../../../utils';
import {MAP_MARKER_CLASS_PREFIX} from '../../../../data';
import {usePickupLocation, useSelectedPickupLocation} from '../../../../composables';
import LeafletMarker from '../../../../components/map/LeafletMarker/LeafletMarker.vue';

const props = defineProps<{pickupLocation: string; active: boolean}>();
const propRefs = toRefs(props);

const location = usePickupLocation(propRefs.pickupLocation);

const center = computed(() => {
  const {latitude, longitude} = location.value?.location;

  return [Number(latitude), Number(longitude)];
});

const options = computed<MarkerOptions>(() => {
  if (!isDef(location.value)) {
    return {};
  }

  return {
    title: location.value?.location.locationName,
    icon: L.divIcon({
      // eslint-disable-next-line no-magic-numbers,@typescript-eslint/no-magic-numbers
      iconAnchor: [24, 58],
      className: `${MAP_MARKER_CLASS_PREFIX} ${MAP_MARKER_CLASS_PREFIX}--${location.value.carrier.name}`,
      html: createCarrierMarkerIcon(location.value.carrier),
    }),
  };
});

const {model} = useSelectedPickupLocation();

const onClick = () => {
  model.value = location.value?.location.locationCode;
};
</script>
