<template>
  <div class="mp-flex-grow">
    <PickupLocationName :location-code="locationCode" />
  </div>

  <span v-text="distance" />

  <CarrierLogo
    v-if="pickupLocation.carrier"
    :carrier="carrierName" />
</template>

<script lang="ts" setup>
import {computed, toRefs} from 'vue';
import {CarrierLogo, resolveCarrierName} from '@myparcel-do/shared';
import {useFormatDistance, usePickupLocation} from '../../../../composables';
import PickupLocationName from './PickupLocationName.vue';

const props = defineProps<{locationCode: string}>();
const propRefs = toRefs(props);

const pickupLocation = usePickupLocation(propRefs.locationCode);

const carrierName = computed(() => resolveCarrierName(pickupLocation.value.carrier));

const plainDistance = computed(() => pickupLocation.value.distance);

const distance = useFormatDistance(plainDistance);
</script>
