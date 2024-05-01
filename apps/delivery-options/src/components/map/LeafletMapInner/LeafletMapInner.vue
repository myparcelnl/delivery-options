<template>
  <div
    ref="container"
    :style="{height}">
    <slot />
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable new-cap */
import {computed, onActivated, onMounted, onUnmounted, provide, ref, toRefs, watch} from 'vue';
import {isString} from 'radash';
import {type Control, type Map, type Marker, type TileLayer, type LatLng} from 'leaflet';
import {isDef, useScriptTag, useStyleTag, useDebounceFn} from '@vueuse/core';
import {type MapTileLayerData} from '@myparcel-do/shared';
import {type LeafletMapProps} from '../../../types';
import {useConfigStore} from '../../../stores';
import {MAP_MARKER_CLASS_ACTIVE} from '../../../data';

// eslint-disable-next-line vue/no-unused-properties
const props = withDefaults(defineProps<LeafletMapProps>(), {
  zoom: 14,
  height: '100%',
  center: () => [0, 0],
});
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

const css = await (await fetch('https://cdn.jsdelivr.net/npm/leaflet@1/dist/leaflet.min.css')).text();
useStyleTag(css);

const tag = useScriptTag('https://cdn.jsdelivr.net/npm/leaflet@1/dist/leaflet.js');
await tag.load();

const config = useConfigStore();

const tileLayerData = computed<MapTileLayerData>(() => {
  if (isString(config.pickupLocationsMapTileLayerData)) {
    return JSON.parse(config.pickupLocationsMapTileLayerData);
  }

  return config.pickupLocationsMapTileLayerData;
});

const getActiveMarkerLatLng = (): undefined | LatLng => {
  const activeMarker = markers.value.find((marker) => marker.getElement()?.classList.contains(MAP_MARKER_CLASS_ACTIVE));

  return activeMarker?.getLatLng();
};

const fitBounds = useDebounceFn(() => {
  if (!container.value) {
    return;
  }

  const group = new L.featureGroup(markers.value as Marker[]);

  map.value?.setView(getActiveMarkerLatLng() ?? props.center, props.zoom);
  map.value?.fitBounds(group.getBounds());
}, 50);

onMounted(() => {
  if (!isDef(container.value)) {
    return;
  }

  const {center, scroll, zoom} = propRefs;
  const {attribution, maxZoom, url, token} = tileLayerData.value;

  map.value = new L.Map(container.value, {preferCanvas: true, scrollWheelZoom: scroll.value});

  if (!isDef(map.value)) {
    return;
  }

  map.value.setView(center.value, zoom.value);
  tileLayer.value = new L.TileLayer(url, {attribution, maxZoom, accessToken: token});
  scale.value = new L.Control.Scale();

  tileLayer.value?.addTo(map.value);
  scale.value?.addTo(map.value);

  map.value.on('layeradd', fitBounds);
  map.value.on('layerremove', fitBounds);
});

onUnmounted(() => {
  map.value?.remove();
});

onUnmounted(watch(propRefs.zoom, () => map.value?.setZoom(propRefs.zoom.value)));

onActivated(() => {
  map.value?.panTo(getActiveMarkerLatLng() ?? propRefs.center.value);
});
</script>
