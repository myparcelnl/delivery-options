<template>
  <div class="mp-flex mp-flex-col mp-gap-2">
    <div class="mp-flex mp-gap-2 mp-items-center">
      <div>
        <PickupLocationName :pickup-location="pickupLocation" />
      </div>

      <CarrierLogo
        v-if="carrier"
        :carrier="carrier.name"
        class="mp-ml-auto" />
    </div>

    <PickupLocationOpeningHours :pickup-location="pickupLocation" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {CarrierLogo} from '@myparcel-do/shared';
import PickupLocationOpeningHours from '../PickupLocationOpeningHours/PickupLocationOpeningHours.vue';
import PickupLocationName from '../PickupLocationList/PickupLocationName.vue';
import {usePickupLocation} from '../../../../composables/usePickupLocation';

const props = defineProps<{pickupLocation: string}>();
const propRefs = toRefs(props);

const {carrier} = usePickupLocation(propRefs.pickupLocation);
</script>
