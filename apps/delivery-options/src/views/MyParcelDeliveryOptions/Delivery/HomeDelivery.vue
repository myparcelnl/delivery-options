<template>
  <div>
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
