<template>
  <div>
    <DeliveryDateSelector />

    <DeliveryMomentSelector />

    <ShipmentOptionsSelector />
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShipmentOptionsSelector from './ShipmentOptionsSelector.vue';
import DeliveryMomentSelector from './DeliveryMomentSelector.vue';
import DeliveryDateSelector from './DeliveryDateSelector.vue';
</script>
