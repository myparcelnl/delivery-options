<template>
  <LeafletMarker
    v-if="pickupLocation && options.icon"
    v-bind="{active, center, options}"
    @click="onClick" />
</template>

<script lang="ts" setup>
import type {MarkerOptions} from 'leaflet';
import type {CarrierIdentifier} from '@myparcel-do/shared';
import {computed, toRefs} from 'vue';
import {isDef} from '@vueuse/core';
import {createCarrierMarkerIcon} from '../../../../utils';
import {MAP_MARKER_CLASS_PREFIX} from '../../../../data';
import {usePickupLocation, useResolvedCarrier, useSelectedValues} from '../../../../composables';
import {LeafletMarker} from '../../../../components';

const props = defineProps<{locationCode: string; active: boolean; carrierIdentifier: CarrierIdentifier}>();
const propRefs = toRefs(props);

const {pickupLocation} = usePickupLocation(propRefs.locationCode, propRefs.carrierIdentifier);

const carrierName = computed(() => pickupLocation.value?.carrier);

const resolvedCarrier = useResolvedCarrier(carrierName).carrier.value;

const center = computed(() => {
  if (!isDef(pickupLocation.value)) {
    return [];
  }

  const {latitude, longitude} = pickupLocation.value;

  return [Number(latitude), Number(longitude)];
});

const options = computed<MarkerOptions>(() => {
  if (!pickupLocation.value || !resolvedCarrier) {
    return {};
  }

  return {
    title: pickupLocation.value.locationName,
    icon: L.divIcon({
      // eslint-disable-next-line no-magic-numbers,@typescript-eslint/no-magic-numbers
      iconAnchor: [24, 58],
      className: `${MAP_MARKER_CLASS_PREFIX} ${MAP_MARKER_CLASS_PREFIX}--${resolvedCarrier?.name}`,
      html: createCarrierMarkerIcon(resolvedCarrier),
    }),
  };
});

const {pickupLocation: selectedPickupLocation, carrier} = useSelectedValues();

const onClick = () => {
  selectedPickupLocation.value = pickupLocation.value?.locationCode;
  carrier.value = propRefs.carrierIdentifier.value;
};
</script>
