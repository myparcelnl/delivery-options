<template>
  <div class="mp-gap-4 mp-grid mp-grid-flow-row">
    <DeliveryDateSelector />

    <DeliveryMomentSelector />

    <ShipmentOptionsSelector />
  </div>
</template>

<script lang="ts" setup>
import ShipmentOptionsSelector from './ShipmentOptionsSelector/ShipmentOptionsSelector.vue';
import DeliveryMomentSelector from './DeliveryMomentSelector/DeliveryMomentSelector.vue';
import DeliveryDateSelector from './DeliveryDateSelector/DeliveryDateSelector.vue';
</script>
