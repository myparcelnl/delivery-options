<template>
  <Loader.Wrapper class="mp-flex mp-flex-col">
    <div
      v-for="i in Number(rows)"
      :key="i"
      class="mp-flex mp-gap-2 mp-items-center mp-py-1">
      <slot name="input" />

      <slot>
        <Loader.Text class="mp-w-24" />
      </slot>

      <Loader.Text
        v-if="price"
        class="mp-ml-auto mp-w-12" />

      <CarrierLogoLoader v-if="carrier" />
    </div>
  </Loader.Wrapper>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-do/shared';
import CarrierLogoLoader from '../../loaders/CarrierLogoLoader.vue';

withDefaults(
  defineProps<{
    rows?: string | number;
    carrier?: boolean;
    price?: boolean;
  }>(),
  {rows: 1},
);
</script>
