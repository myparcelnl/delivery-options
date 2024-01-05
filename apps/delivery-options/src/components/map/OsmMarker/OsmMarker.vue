<template>
  <slot />
</template>

<script lang="ts" setup>
import {inject, onUnmounted, type Ref, ref, toRefs, watch} from 'vue';
import {type Map, type Marker, type MarkerOptions} from 'leaflet';
import {isDef, watchOnce} from '@vueuse/core';

const props = defineProps<{center: [number, number]; options: MarkerOptions}>();
const propRefs = toRefs(props);

const emit = defineEmits<(event: 'click', marker: Marker) => void>();

const map = inject<Ref<Map | undefined>>('map');
const markers = inject<Ref<Marker[]>>('markers');

const marker = ref<Marker>();

watchOnce(
  () => map,
  (map) => {
    onUnmounted(
      watch(
        propRefs.options,
        () => {
          const {options, center} = propRefs;

          if (isDef(marker.value)) {
            marker.value.options = options.value;
          } else {
            marker.value = L.marker(center.value, options.value);

            if (!isDef(marker.value)) {
              return;
            }

            marker.value.on('click', () => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              emit('click', marker.value!);
            });

            markers?.value?.push(marker.value);

            map?.value?.addLayer(marker.value);
          }
        },
        {immediate: true},
      ),
    );
  },
  {immediate: Boolean(map?.value)},
);

onUnmounted(() => {
  if (!isDef(marker.value)) {
    return;
  }

  map?.value?.removeLayer(marker.value);
});
</script>
