<template>
  <div>
    <DeliveryDateSelector />

    <DeliveryMomentSelector />
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/naming-convention
import {useDeliveryOptionsConfig} from '@myparcel-do/shared';
import DeliveryDateSelector from './DeliveryDateSelector.vue';

const config = useDeliveryOptionsConfig();

console.log(config);
</script>
