<template>
  <span v-if="formattedPrice">{{ formattedPrice }}</span>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {ConfigSetting, useConfigStore, useLanguage} from '@myparcel-dev/delivery-options';

const props = defineProps<{price: number}>();
const {state: config} = useConfigStore();
const {translate} = useLanguage();

const formattedPrice = computed(() => {
  if (props.price <= 0 && config[ConfigSetting.ShowPriceZeroAsFree]) {
    return translate('free');
  }

  if (props.price !== 0) {
    return props.price.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    });
  }

  return null;
});
</script>
