<template>
  <div>
    <PickupLocationName :pickup-location="pickupLocation" />
  </div>

  <div class="mp-flex mp-gap-2 mp-items-center mp-ml-auto">
    <span v-text="location?.distance" />

    <CarrierLogo
      v-if="location?.carrier"
      :carrier="location.carrier.name" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {CarrierLogo} from '@myparcel-do/shared';
import {usePickupLocation} from '../../../../composables';
import PickupLocationName from './PickupLocationName.vue';

const props = defineProps<{pickupLocation: string}>();
const propRefs = toRefs(props);

const location = usePickupLocation(propRefs.pickupLocation);
</script>
