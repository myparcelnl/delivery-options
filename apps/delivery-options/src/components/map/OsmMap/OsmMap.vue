<template>
  <div class="overflow-hidden">
    <Suspense>
      <template #fallback>Loading...</template>

      <template #default>
        <OsmMapInner v-bind="props">
          <slot />
        </OsmMapInner>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import OsmMapInner from '../OsmMapInner/OsmMapInner.vue';
import {type OsmMapProps} from '../../../types/map.types';

// eslint-disable-next-line vue/no-unused-properties
const props = withDefaults(defineProps<OsmMapProps>(), {
  zoom: 14,
  height: '100%',
});
</script>
