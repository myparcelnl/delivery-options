<template>
  <div>
    <PickupLocationName :location-code="locationCode" />
  </div>

  <div class="mp-flex mp-gap-2 mp-items-center mp-ml-auto">
    <span v-text="pickupLocation?.distance" />

    <CarrierLogo
      v-if="pickupLocation?.carrier"
      :carrier="pickupLocation.carrier.name" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {CarrierLogo} from '@myparcel-do/shared';
import {usePickupLocation} from '../../../../composables';
import PickupLocationName from './PickupLocationName.vue';

const props = defineProps<{locationCode: string}>();
const propRefs = toRefs(props);

const pickupLocation = usePickupLocation(propRefs.locationCode);
</script>
