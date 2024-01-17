<template>
  <LeafletMarker
    v-if="carrier"
    v-bind="{active, center, options}"
    @click="onClick" />
</template>

<script lang="ts" setup>
import {computed, toRefs} from 'vue';
import {type MarkerOptions} from 'leaflet';
import {createCarrierMarkerIcon} from '../../../../utils';
import {MAP_MARKER_CLASS_PREFIX} from '../../../../data';
import {usePickupLocation, useSelectedPickupLocation} from '../../../../composables';
import LeafletMarker from '../../../../components/map/LeafletMarker/LeafletMarker.vue';

const props = defineProps<{pickupLocation: string; active: boolean}>();
const propRefs = toRefs(props);

const {carrier, location} = usePickupLocation(propRefs.pickupLocation);

const center = computed(() => {
  const {latitude, longitude} = location.value;

  return [Number(latitude), Number(longitude)];
});

const options = computed<MarkerOptions>(() => {
  return {
    title: location.value.locationName,
    icon: L.divIcon({
      // eslint-disable-next-line no-magic-numbers,@typescript-eslint/no-magic-numbers
      iconAnchor: [24, 58],
      className: `${MAP_MARKER_CLASS_PREFIX} ${MAP_MARKER_CLASS_PREFIX}--${carrier.value.name}`,
      html: createCarrierMarkerIcon(carrier.value),
    }),
  };
});

const {model} = useSelectedPickupLocation();

const onClick = () => {
  model.value = location.value.locationCode;
};
</script>
