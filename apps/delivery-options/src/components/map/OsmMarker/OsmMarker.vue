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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const map = inject<Ref<Map | undefined>>('map')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const markers = inject<Ref<Marker[]>>('markers')!;

const marker = ref<Marker>();

const CLASS_MARKER_ACTIVE = 'active';

const toggleActiveClass = (): void => {
  markers?.value.forEach((item) => {
    if (item === marker.value) {
      return;
    }

    item.getElement()?.classList.remove(CLASS_MARKER_ACTIVE);
  });

  marker.value?.getElement()?.classList.add(CLASS_MARKER_ACTIVE);
};

const onMarkerClick = (): void => {
  if (!isDef(marker.value)) {
    return;
  }

  toggleActiveClass();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  emit('click', marker.value);
  map.value?.panTo(marker.value.getLatLng());
};

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

            marker.value.on('click', onMarkerClick);
            markers.value.push(marker.value);

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
