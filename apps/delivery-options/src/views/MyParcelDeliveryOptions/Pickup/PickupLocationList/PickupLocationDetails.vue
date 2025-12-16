<template>
  <div class="mp-border mp-p-5 mp-rounded-lg">
    <PickupLocationOpeningHours
      :carrier-identifier="carrierIdentifier"
      :location-code="locationCode" />
  </div>
</template>

<script
  lang="ts"
  setup>
import PickupLocationOpeningHours from '../PickupLocationOpeningHours/PickupLocationOpeningHours.vue';
import type {CarrierIdentifier} from '@myparcel-dev/do-shared';

defineProps<{
  /**
   * JSON encoded ResolvedPickupLocation
   * @see ResolvedPickupLocation
   */
  locationCode: string;
  carrierIdentifier: CarrierIdentifier
}>();
</script>
