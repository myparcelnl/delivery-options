<template>
  <template v-if="pickupLocation">
    <div class="mp-flex-grow">
      <PickupLocationName
        :carrier-identifier="carrierIdentifier"
        :location-code="locationCode" />
    </div>

    <span v-text="distance" />

    <CarrierLogo
      v-if="pickupLocation.carrier"
      :carrier="pickupLocation.carrier" />
  </template>
</template>

<script lang="ts" setup>
import {computed, toRefs} from 'vue';
import {CarrierLogo, type CarrierIdentifier} from '@myparcel-do/shared';
import {useFormatDistance, usePickupLocation} from '../../../../composables';
import PickupLocationName from './PickupLocationName.vue';

const props = defineProps<{locationCode: string; carrierIdentifier: CarrierIdentifier}>();
const propRefs = toRefs(props);

const {pickupLocation} = usePickupLocation(propRefs.locationCode, propRefs.carrierIdentifier);

const plainDistance = computed(() => pickupLocation.value?.distance);

const distance = useFormatDistance(plainDistance);
</script>
