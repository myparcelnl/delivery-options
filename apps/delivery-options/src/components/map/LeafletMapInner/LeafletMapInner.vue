<template>
  <div
    ref="container"
    style="height: 100%">
    <LeafletMapLoadMoreButton />

    <slot />
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable new-cap */
import {ref, nextTick, onMounted, toValue, onUnmounted, onActivated} from 'vue';
import {asyncComputed, useStyleTag, useScriptTag} from '@vueuse/core';
import {usePickupLocationsMap} from '../../../composables';
import LeafletMapLoadMoreButton from './LeafletMapLoadMoreButton.vue';

const unmountHooks: (() => void)[] = [];
const container = ref<HTMLElement>();

const css = asyncComputed(async () => {
  return (await fetch('https://cdn.jsdelivr.net/npm/leaflet@1/dist/leaflet.min.css')).text();
});

const styleTag = useStyleTag(css);
const scriptTag = useScriptTag('https://cdn.jsdelivr.net/npm/leaflet@1/dist/leaflet.js', undefined, {
  manual: true,
});

// @ts-expect-error ignore window.L not being defined, as we are checking that here
if (window.L === undefined) {
  await scriptTag.load();
} else {
  console.debug('Leaflet JS already loaded');
}

const {initializeMap, activeMarker, center, map, loaded} = usePickupLocationsMap();

onMounted(async () => {
  try {
    styleTag.load();
  } catch (error) {
    console.error('Error loading Leaflet CSS:', error);
  }

  const teardownMap = initializeMap(container);

  if (teardownMap) {
    unmountHooks.push(teardownMap);
  }

  // Required when the map is mounted inside a previously-hidden container
  // (e.g. a modal). Harmless when mounted inline since the container size
  // doesn't change.
  await nextTick();
  map.value?.invalidateSize();
});

onUnmounted(() => {
  unmountHooks.forEach((hook) => hook());
  styleTag.unload();
  scriptTag.unload();
});

onActivated(() => {
  if (loaded.value) {
    map.value?.panTo(toValue(activeMarker)?.getLatLng() ?? toValue(center));
  }
});
</script>
