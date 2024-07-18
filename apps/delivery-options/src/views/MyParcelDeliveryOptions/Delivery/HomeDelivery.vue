<template>
  <div class="mp-gap-4 mp-grid">
    <DeliveryDateSelector />

    <DeliveryMomentSelector />

    <ShipmentOptionsSelector />
  </div>
</template>

<script lang="ts" setup>
import {useResolvedDeliveryOptions} from '../../../composables';
import ShipmentOptionsSelector from './ShipmentOptionsSelector/ShipmentOptionsSelector.vue';
import DeliveryMomentSelector from './DeliveryMomentSelector/DeliveryMomentSelector.vue';
import DeliveryDateSelector from './DeliveryDateSelector/DeliveryDateSelector.vue';

const deliveryOptions = useResolvedDeliveryOptions();

void deliveryOptions.load();
</script>
