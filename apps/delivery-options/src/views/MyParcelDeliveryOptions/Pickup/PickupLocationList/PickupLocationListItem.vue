<template>
  <div>
    <PickupLocationName :pickup-location="pickupLocation" />
  </div>

  <div class="mp-flex mp-gap-2 mp-items-center mp-ml-auto">
    <span v-text="distance" />

    <CarrierLogo
      v-if="carrier"
      :carrier="carrier.name" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {CarrierLogo} from '@myparcel-do/shared';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import PickupLocationName from './PickupLocationName.vue';

const props = defineProps<{pickupLocation: string}>();
const propRefs = toRefs(props);

const {distance, carrier} = usePickupLocation(propRefs.pickupLocation);
</script>
