<template>
  <Loader.Wrapper class="mp-flex mp-flex-col">
    <div
      v-for="i in Number(rows)"
      :key="i"
      class="mp-flex mp-gap-2 mp-items-center mp-py-1">
      <slot />

      <Loader.Text class="mp-w-24" />

      <Loader.Text
        v-if="price"
        class="mp-ml-auto mp-w-12" />
      <Loader.Circle
        v-if="carrier"
        class="mp-h-8 mp-w-8" />
    </div>
  </Loader.Wrapper>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-do/shared';

withDefaults(
  defineProps<{
    rows?: string | number;
    carrier?: boolean;
    price?: boolean;
  }>(),
  {rows: 1},
);
</script>
