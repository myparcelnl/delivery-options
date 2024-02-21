<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {inject, onUnmounted, type Ref, ref, toRefs, watch} from 'vue';
import {type Map, type MarkerOptions} from 'leaflet';
import {isDef} from '@vueuse/core';
import {ElementEvent} from '@myparcel-do/shared';
import {type Marker} from '../../../types';
import {MAP_MARKER_CLASS_ACTIVE} from '../../../data';

const props = defineProps<{center: [number, number]; options: MarkerOptions; active?: boolean}>();
const propRefs = toRefs(props);

const emit = defineEmits<(event: ElementEvent.Click, marker: Marker) => void>();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const map = inject<Ref<Map | undefined>>('map')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const markers = inject<Ref<Marker[]>>('markers')!;

const marker = ref<Marker>();

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
    marker.value = L.marker(center.value, options.value) as Marker;

    if (!isDef(marker.value)) {
      return;
    }

    marker.value.on(ElementEvent.Click, onMarkerClick);
    marker.value.on(ElementEvent.Keydown, (event) => {
      if (!['Enter', 'Space'].includes(event.originalEvent.key)) {
        return;
      }

      onMarkerClick();
    });

    markers.value.push(marker.value);

    map?.value?.addLayer(marker.value);
  }

  watch(propRefs.active, setActive, {immediate: true});
};

onUnmounted(watch([propRefs.options, map], addMarker, {immediate: true}));

onUnmounted(() => {
  if (!isDef(marker.value)) {
    return;
  }

  map?.value?.removeLayer(marker.value);
  // eslint-disable-next-line no-underscore-dangle
  markers.value = markers.value.filter((item) => item._leaflet_id !== marker.value?._leaflet_id);
});
</script>
