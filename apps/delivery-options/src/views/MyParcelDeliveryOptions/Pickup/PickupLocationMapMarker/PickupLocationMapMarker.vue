<template>
  <LeafletMarker
    v-if="pickupLocation"
    v-bind="{active, center, options}"
    @click="onClick" />
</template>

<script lang="ts" setup>
import {computed, toRefs} from 'vue';
import {type MarkerOptions} from 'leaflet';
import {isDef} from '@vueuse/core';
import {createCarrierMarkerIcon} from '../../../../utils';
import {useDeliveryOptionsForm} from '../../../../form';
import {FIELD_PICKUP_LOCATION, MAP_MARKER_CLASS_PREFIX} from '../../../../data';
import {usePickupLocation} from '../../../../composables';
import LeafletMarker from '../../../../components/map/LeafletMarker/LeafletMarker.vue';

const props = defineProps<{locationCode: string; active: boolean}>();
const propRefs = toRefs(props);

const form = useDeliveryOptionsForm();
const pickupLocation = usePickupLocation(propRefs.locationCode);

const center = computed(() => {
  if (!isDef(pickupLocation.value)) {
    return [];
  }

  const {location} = pickupLocation.value;

  return [Number(location.latitude), Number(location.longitude)];
});

const options = computed<MarkerOptions>(() => {
  if (!isDef(pickupLocation.value)) {
    return {};
  }

  const {location, carrier} = pickupLocation.value;

  return {
    title: location.locationName,
    icon: L.divIcon({
      // eslint-disable-next-line no-magic-numbers,@typescript-eslint/no-magic-numbers
      iconAnchor: [24, 58],
      className: `${MAP_MARKER_CLASS_PREFIX} ${MAP_MARKER_CLASS_PREFIX}--${carrier.name}`,
      html: createCarrierMarkerIcon(carrier),
    }),
  };
});

const onClick = () => {
  form.instance.setValue(FIELD_PICKUP_LOCATION, pickupLocation.value?.location.locationCode);
};
</script>
