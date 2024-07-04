<template>
  <div class="mp-select-none overflow-hidden">
    <Suspense>
      <template #fallback>
        <Loader.Wrapper>
          <Loader.Base class="mp-h-full mp-w-full" />
        </Loader.Wrapper>
      </template>

      <template #default>
        <LeafletMapInner>
          <slot />
        </LeafletMapInner>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-do/shared';
import LeafletMapInner from '../LeafletMapInner/LeafletMapInner.vue';
</script>
