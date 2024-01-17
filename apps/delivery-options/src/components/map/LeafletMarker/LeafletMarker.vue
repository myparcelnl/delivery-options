<template>
  <slot />
</template>

<script lang="ts" setup>
import {inject, onUnmounted, type Ref, ref, toRefs, watch} from 'vue';
import {type Map, type Marker, type MarkerOptions} from 'leaflet';
import {isDef} from '@vueuse/core';
import {MAP_MARKER_CLASS_ACTIVE} from '../../../data';

const props = defineProps<{center: [number, number]; options: MarkerOptions; active?: boolean}>();
const propRefs = toRefs(props);

const emit = defineEmits<(event: 'click', marker: Marker) => void>();

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
  emit('click', marker.value);
  map.value?.panTo(marker.value.getLatLng());
};

const addMarker = (): void => {
  if (!map.value) {
    return;
  }

  const {options, center} = propRefs;

  if (isDef(marker.value)) {
    marker.value.options = options.value;
  } else {
    marker.value = L.marker(center.value, options.value);

    if (!isDef(marker.value)) {
      return;
    }

    marker.value.on('click', onMarkerClick);
    markers.value.push(marker.value);

    map?.value?.addLayer(marker.value);
  }
};

const setActive = (): void => {
  if (!isDef(marker.value)) {
    return;
  }

  marker.value.getElement()?.classList[propRefs.active.value ? 'add' : 'remove'](MAP_MARKER_CLASS_ACTIVE);
};

const unwatchAddMarker = watch([propRefs.options, map], addMarker, {immediate: true});
const unwatchSetActive = watch(propRefs.active, setActive, {immediate: true});

onUnmounted(() => {
  unwatchAddMarker();
  unwatchSetActive();

  if (!isDef(marker.value)) {
    return;
  }

  map?.value?.removeLayer(marker.value);
});
</script>
