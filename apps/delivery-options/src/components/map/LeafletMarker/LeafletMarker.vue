<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type {MarkerOptions} from 'leaflet';
import type {MapMarker} from '../../../types';
import {onUnmounted, ref, toRefs, watch, onMounted, toValue} from 'vue';
import {isDef, watchOnce} from '@vueuse/core';
import {ElementEvent} from '@myparcel-dev/shared';
import {MAP_MARKER_CLASS_ACTIVE} from '../../../data';
import {usePickupLocationsMap} from '../../../composables';

const props = defineProps<{center: [number, number]; options: MarkerOptions; active?: boolean}>();
const propRefs = toRefs(props);

const emit = defineEmits<(event: ElementEvent.Click, marker: MapMarker) => void>();

const {map, markers, loaded: mapLoaded} = usePickupLocationsMap();

const marker = ref<MapMarker>();

const onMarkerClick = (): void => {
  if (!isDef(marker.value)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  emit(ElementEvent.Click, marker.value);
  map.value?.panTo(marker.value.getLatLng());
};

const setActive = (): void => {
  if (!isDef(marker.value)) {
    return;
  }

  marker.value.getElement()?.classList[propRefs.active.value ? 'add' : 'remove'](MAP_MARKER_CLASS_ACTIVE);
};

const addMarker = (): void => {
  if (!map.value) {
    return;
  }

  const {options, center} = propRefs;

  if (isDef(marker.value)) {
    marker.value.options = options.value;
  } else {
    marker.value = L.marker(center.value, options.value) as MapMarker;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const markerValue = toValue(marker)!;

    markerValue.on(ElementEvent.Click, onMarkerClick);
    markerValue.on(ElementEvent.Keydown, (event) => {
      if (!['Enter', 'Space'].includes(event.originalEvent.key)) {
        return;
      }

      onMarkerClick();
    });

    markers.value.push(markerValue);

    // @ts-expect-error todo: fix leaflet type errors
    map.value?.addLayer(markerValue);
  }

  watch(propRefs.active, setActive, {immediate: true});
};

onMounted(() => {
  if (mapLoaded.value) {
    addMarker();
  } else {
    watchOnce(mapLoaded, addMarker);
  }
});

onUnmounted(() => {
  if (!isDef(marker.value)) {
    return;
  }

  // @ts-expect-error todo: fix leaflet type errors
  map.value?.removeLayer(marker.value);

  // eslint-disable-next-line no-underscore-dangle
  markers.value = markers.value.filter((item) => item._leaflet_id !== marker.value?._leaflet_id);
});
</script>
