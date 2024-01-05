<template>
  <div class="mp-flex mp-flex-col mp-gap-1">
    <PickupLocationName :pickup-location="pickupLocation" />

    <PickupLocationOpeningHours :pickup-location="pickupLocation" />
  </div>
</template>

<script lang="ts" setup>
import PickupLocationOpeningHours from '../PickupLocationOpeningHours/PickupLocationOpeningHours.vue';
import PickupLocationName from '../PickupLocationList/PickupLocationName.vue';

defineProps<{
  /**
   * JSON encoded ResolvedPickupLocation
   * @see ResolvedPickupLocation
   */
  pickupLocation: string;
}>();
</script>
