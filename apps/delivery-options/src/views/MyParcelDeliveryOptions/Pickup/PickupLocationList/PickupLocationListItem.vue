<template>
  <div>
    <p v-text="location?.location.location_name" />

    <p
      class="mp-opacity-60"
      v-text="address" />
  </div>

  <span
    class="mp-ml-auto"
    v-text="distance" />
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {usePickupLocation} from '../../../../composables/usePickupLocation';

const props = defineProps<{locationCode: string}>();
const propRefs = toRefs(props);

const {address, distance, location} = usePickupLocation(propRefs.locationCode);
</script>
