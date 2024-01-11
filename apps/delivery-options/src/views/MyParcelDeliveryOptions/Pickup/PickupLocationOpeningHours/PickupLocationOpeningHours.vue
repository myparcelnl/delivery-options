<template>
  <b
    class="mp-block"
    v-text="translate(OPENING_HOURS)" />

  <div
    v-for="hours in openingHours"
    :key="hours.weekday"
    class="mp-content-between mp-gap-1 mp-grid mp-grid-cols-2">
    <span v-text="hours.weekday" />
    <span
      class="mp-text-nowrap"
      v-text="hours.timeString" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {OPENING_HOURS} from '@myparcel-do/shared';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import {useLanguage} from '../../../../composables';

const props = defineProps<{pickupLocation: string}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const {openingHours} = usePickupLocation(propRefs.pickupLocation);
</script>
