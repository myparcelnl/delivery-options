<template>
  <div></div>
</template>

<script lang="ts" setup>
import {inject, onMounted, onUnmounted, ref, type Ref, toRefs} from 'vue';
import {type Map, type Marker, type MarkerOptions} from 'leaflet';

const props = defineProps<{center: [number, number]; options: MarkerOptions}>();
const propRefs = toRefs(props);

const map = inject<Ref<Map>>('map');

const marker = ref<Marker>();

onMounted(() => {
  const {options, center} = propRefs;

  console.log('marker', options.value, center.value);

  marker.value = L.marker(center.value, {
    icon: L.icon({iconUrl: '/assets/images/marker-icon.png'}),
    ...options.value,
  });

  map?.value.addLayer(marker.value);
});

onUnmounted(() => {
  if (!marker.value) {
    return;
  }

  map?.value.removeLayer(marker.value);
});
</script>
