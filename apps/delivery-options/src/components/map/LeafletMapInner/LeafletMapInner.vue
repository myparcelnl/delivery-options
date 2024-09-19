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
import {asyncComputed, useStyleTag, useScriptTag} from '@vueuse/core';
import {usePickupLocationsMap} from '../../../composables';
import LeafletMapLoadMoreButton from './LeafletMapLoadMoreButton.vue';

const unmountHooks = [];
const container = ref<HTMLElement>();

const css = asyncComputed(async () => {
  return (await fetch('https://cdn.jsdelivr.net/npm/leaflet@1/dist/leaflet.min.css')).text();
});

const styleTag = useStyleTag(css);
const scriptTag = useScriptTag('https://cdn.jsdelivr.net/npm/leaflet@1/dist/leaflet.js');

const {initializeMap, activeMarker, center, map, loaded} = usePickupLocationsMap();

onMounted(async () => {
  styleTag.load();
  await scriptTag.load();

  const teardownMap = initializeMap(container);

  unmountHooks.push(teardownMap);
});

onUnmounted(() => {
  scriptTag.unload();
  styleTag.unload();
  unmountHooks.forEach((hook) => hook());
});

onActivated(() => {
  if (loaded.value) {
    map.value?.panTo(toValue(activeMarker)?.getLatLng() ?? toValue(center));
  }
});
</script>
