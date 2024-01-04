<template>
  <div></div>
</template>

<script lang="ts" setup>
import {inject, onUnmounted, type Ref, ref, toRefs, watch} from 'vue';
import {type Map, type Marker, type MarkerOptions} from 'leaflet';
import {watchOnce} from '@vueuse/core';

const props = defineProps<{center: [number, number]; options: MarkerOptions}>();
const propRefs = toRefs(props);

const map = inject<Ref<Map | undefined>>('map');
const markers = inject<Ref<Marker[]>>('markers');

const emit = defineEmits<{
  render(marker: Marker): void;
}>();

const marker = ref<Marker>();

watchOnce(
  () => map,
  (map) => {
    onUnmounted(
      watch(
        propRefs.options,
        () => {
          const {options, center} = propRefs;

          if (marker.value) {
            marker.value.options = options.value;
          } else {
            marker.value = L.marker(center.value, options.value);

            markers?.value?.push(marker.value);

            map?.value?.addLayer(marker.value);

            emit('render', marker.value);
          }
        },
        {immediate: true},
      ),
    );
  },
  {immediate: Boolean(map?.value)},
);

onUnmounted(() => {
  if (!marker.value) {
    return;
  }

  map?.value?.removeLayer(marker.value);
});
</script>
