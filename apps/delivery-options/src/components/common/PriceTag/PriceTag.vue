<template>
  <span v-if="formattedPrice">{{ formattedPrice }}</span>
</template>

<script lang="ts" setup>
import { ConfigSetting, useLanguage } from '@myparcel/delivery-options';
import { useConfigStore } from '@myparcel/delivery-options';
import {computed} from 'vue';

const props = defineProps<{price: number}>();
const { state: config } = useConfigStore();
const { translate } = useLanguage();

const formattedPrice = computed(() => {
  if (props.price > 0) {
    return props.price.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    });
  }
  if (config[ConfigSetting.ShowPriceZeroAsFree]) {
    return translate('free');
  }
  return null;
});
</script>
