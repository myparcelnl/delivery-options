<template>
  <div class="mp-select-none overflow-hidden">
    <Suspense>
      <template #fallback>
        <Loader.Wrapper>
          <Loader.Base class="mp-h-full mp-w-full" />
        </Loader.Wrapper>
      </template>

      <template #default>
        <LeafletMapInner v-bind="props">
          <slot />
        </LeafletMapInner>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-do/shared';
import LeafletMapInner from '../LeafletMapInner/LeafletMapInner.vue';
import {type LeafletMapProps} from '../../../types';

// eslint-disable-next-line vue/no-unused-properties
const props = withDefaults(defineProps<LeafletMapProps>(), {
  zoom: 14,
  height: '100%',
});
</script>
