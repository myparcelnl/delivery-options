<template>
  <div>
    <MyParcelDeliveryOptions
      v-if="store.configuration"
      :config="parsedConfiguration"
      @update="output = $event" />

    <h2>Output</h2>
    <div>
      <pre v-text="output" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';
import {construct} from 'radash';
import {type DeliveryOptionsConfiguration, type DeliveryOptionsOutput} from '@myparcel-do/shared';
import {MyParcelDeliveryOptions} from '@myparcel/delivery-options/ts';
import {useSandboxStore} from '../stores';

const output = ref<DeliveryOptionsOutput | null>(null);

const store = useSandboxStore();

const parsedConfiguration = computed(() => {
  return reactive(construct(store.configuration)) as DeliveryOptionsConfiguration;
});
</script>
