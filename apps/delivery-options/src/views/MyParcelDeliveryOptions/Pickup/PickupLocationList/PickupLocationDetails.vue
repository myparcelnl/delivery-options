<template>
  <div class="mp-border mp-p-5 mp-rounded-lg">
    <div class="mp-grid">
      <div>
        <b
          class="mp-block"
          v-text="translate(OPENING_HOURS)" />

        <div
          v-for="hours in openingHours"
          :key="hours.weekday"
          class="mp-content-between mp-gap-4 mp-grid mp-grid-cols-2">
          <span v-text="hours.weekday" />
          <span v-text="hours.timeString" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {OPENING_HOURS} from '@myparcel-do/shared';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import {useLanguage} from '../../../../composables';

const props = defineProps<{
  /**
   * JSON encoded ResolvedPickupLocation
   * @see ResolvedPickupLocation
   */
  location: string;
}>();

const propRefs = toRefs(props);

const {translate} = useLanguage();

const {openingHours} = usePickupLocation(propRefs.location);
</script>
