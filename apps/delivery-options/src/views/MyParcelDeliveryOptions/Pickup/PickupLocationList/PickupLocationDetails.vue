<template>
  <div class="mp-border mp-p-5 mp-rounded-lg">
    <PickupLocationOpeningHours :location-code="locationCode" />
  </div>
</template>

<script lang="ts" setup>
import PickupLocationOpeningHours from '../PickupLocationOpeningHours/PickupLocationOpeningHours.vue';

defineProps<{
  /**
   * JSON encoded ResolvedPickupLocation
   * @see ResolvedPickupLocation
   */
  locationCode: string;
}>();
</script>
