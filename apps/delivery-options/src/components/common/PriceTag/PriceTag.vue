<template>
  <span v-if="formattedPrice">{{ formattedPrice }}</span>
</template>

<script lang="ts" setup>
import {computed, toRef} from 'vue';
import {ConfigSetting, useConfigStore, useFormatPrice, useLanguage} from '@myparcel-dev/delivery-options';

const props = defineProps<{price: number}>();
const {state: config} = useConfigStore();
const {translate} = useLanguage();
const price = useFormatPrice(toRef(props, 'price'));

const formattedPrice = computed(() => {
  if (props.price <= 0 && config[ConfigSetting.ShowPriceZeroAsFree]) {
    return translate('free');
  }

  if (props.price !== 0) {
    return price.value;
  }

  return null;
});
</script>
