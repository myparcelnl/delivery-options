<template>
  <Story>
    <Variant title="€ 0">
      <PriceTag :price="0" />
    </Variant>

    <Variant title="€ 10">
      <PriceTag :price="10" />
    </Variant>
    <Variant title="€ 3.59">
      <PriceTag :price="3.59" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PriceTag from './PriceTag.vue';
</script>
