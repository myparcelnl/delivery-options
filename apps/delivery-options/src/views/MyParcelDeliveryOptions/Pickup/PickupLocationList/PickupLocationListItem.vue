<template>
  <div>
    <PickupLocationName :pickup-location="pickupLocation" />
  </div>

  <span
    class="mp-ml-auto"
    v-text="distance" />
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import PickupLocationName from './PickupLocationName.vue';

const props = defineProps<{
  /**
   * JSON encoded ResolvedPickupLocation
   * @see ResolvedPickupLocation
   * */
  pickupLocation: string;
}>();
const propRefs = toRefs(props);

const {distance} = usePickupLocation(propRefs.pickupLocation);
</script>
