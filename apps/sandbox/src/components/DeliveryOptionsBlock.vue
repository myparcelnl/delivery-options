<template>
  <div>
    <MyParcelDeliveryOptions
      :config="deliveryOptionsConfig"
      @update="output = $event" />

    <h2>Output</h2>
    <div>
      <pre v-text="output" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {type DeliveryOptionsOutput} from '@myparcel-do/shared';
import {MyParcelDeliveryOptions} from '@myparcel/delivery-options/ts';
import {useSandboxConfig} from '../composables/useSandboxConfig';

const output = ref<DeliveryOptionsOutput | null>(null);

const config = useSandboxConfig();

const deliveryOptionsConfig = computed(() => config.value);
</script>
