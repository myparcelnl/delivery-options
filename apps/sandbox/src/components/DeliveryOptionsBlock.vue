<template>
  <MyParcelDeliveryOptions
    v-if="store.resolvedConfiguration"
    :configuration="store.resolvedConfiguration" />
</template>

<script
  lang="ts"
  setup>
import {MyParcelDeliveryOptions} from '@myparcel/delivery-options';
import {useSandboxStore} from '../stores';

const store = useSandboxStore();
</script>
