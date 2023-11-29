<template>
  <MyParcelDeliveryOptions
    v-if="store.configuration"
    :config="parsedConfiguration" />
</template>

<script lang="ts" setup>
import {computed, reactive} from 'vue';
import {construct} from 'radash';
import {type DeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {MyParcelDeliveryOptions} from '@myparcel/delivery-options/ts';
import {useSandboxStore} from '../stores';

const store = useSandboxStore();

const parsedConfiguration = computed(() => {
  return reactive(construct(store.configuration)) as DeliveryOptionsConfiguration;
});
</script>
