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
import {ref, onMounted, toValue, onUnmounted, onActivated} from 'vue';
import {asyncComputed, useStyleTag, useScriptTag, useResizeObserver} from '@vueuse/core';
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

const {initializeMap, fitBounds, activeMarker, center, map, loaded} = usePickupLocationsMap();

onMounted(() => {
  try {
    styleTag.load();
  } catch (error) {
    console.error('Error loading Leaflet CSS:', error);
  }

  const teardownMap = initializeMap(container);

  if (teardownMap) {
    unmountHooks.push(teardownMap);
  }
});

// Leaflet does not detect size changes, e.g. a hidden tab or modal that opens, or a checkout layout change.
// Re-fit only when the container had no size yet; a re-fit on every resize would reset the consumer's pan and zoom.
useResizeObserver(container, () => {
  const hadSize = Boolean(map.value?.getSize().x);

  map.value?.invalidateSize();

  if (!hadSize) {
    fitBounds();
  }
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
