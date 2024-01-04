<template>
  <div class="overflow-hidden">
    <div
      ref="container"
      :style="{height}" />

    <slot />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, provide, ref, toRefs, watch} from 'vue';
import {isString} from 'radash';
import {type Control, type Map, type Marker, type TileLayer} from 'leaflet';
import {useDebounceFn, useScriptTag, useStyleTag} from '@vueuse/core';
import {type MapTileLayerData} from '@myparcel-do/shared';
import {type OsmMapProps} from '../../../types/map.types';
import {useConfigStore} from '../../../stores';

const props = defineProps<Required<OsmMapProps>>();
const propRefs = toRefs(props);

const container = ref<HTMLElement>();

const map = ref<Map>();
const tileLayer = ref<TileLayer>();
const scale = ref<Control.Scale>();
const markers = ref<Marker[]>([]);

provide('map', map);
provide('tileLayer', tileLayer);
provide('scale', scale);
provide('markers', markers);

const css = await (await fetch('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')).text();
useStyleTag(css);

const tag = useScriptTag('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
await tag.load();

const config = useConfigStore();

const tileLayerData = computed<MapTileLayerData>(() => {
  if (isString(config.pickupLocationsMapTileLayerData)) {
    return JSON.parse(config.pickupLocationsMapTileLayerData);
  }

  return config.pickupLocationsMapTileLayerData;
});

const fitBounds = useDebounceFn(() => {
  const group = new L.featureGroup(markers.value as Marker[]);

  map.value?.fitBounds(group.getBounds());
  map.value?.setZoom(propRefs.zoom.value);
}, 100);

onMounted(() => {
  const {center, scroll, zoom} = propRefs;
  const {attribution, maxZoom, url, token} = tileLayerData.value;

  map.value = new L.Map(container.value, {
    preferCanvas: true,
    scrollWheelZoom: scroll.value,
  }).setView(center.value ?? [0, 0], zoom.value);

  tileLayer.value = new L.TileLayer(url, {attribution, maxZoom, accessToken: token});
  scale.value = new L.Control.Scale();

  tileLayer.value?.addTo(map.value);
  scale.value?.addTo(map.value);

  map.value?.on('layeradd', fitBounds);
});

onUnmounted(() => {
  map.value?.remove();
});

onUnmounted(watch(propRefs.zoom, () => map.value?.setZoom(propRefs.zoom.value)));
</script>
