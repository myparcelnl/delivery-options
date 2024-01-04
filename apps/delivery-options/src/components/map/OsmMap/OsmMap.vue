<template>
  <div class="overflow-hidden">
    <Suspense>
      <template #fallback>Loading...</template>

      <template #default>
        <OsmMapInner v-bind="props" />
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import {useScriptTag, useStyleTag} from '@vueuse/core';
import OsmMapInner from '../OsmMapInner/OsmMapInner.vue';
import {type OsmMapProps} from '../../../types/map.types';

// eslint-disable-next-line vue/no-unused-properties
const props = withDefaults(defineProps<OsmMapProps>(), {
  zoom: 14,
  height: '400px',
});

const css = (await fetch('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')).text();

useStyleTag(await css);

const tag = useScriptTag('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
await tag.load();
</script>
