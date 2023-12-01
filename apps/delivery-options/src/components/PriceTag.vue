<template>
  <span>{{ formattedPrice }}</span>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{price: number}>();

const formattedPrice = computed(() => {
  return props.price.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  });
});
</script>
