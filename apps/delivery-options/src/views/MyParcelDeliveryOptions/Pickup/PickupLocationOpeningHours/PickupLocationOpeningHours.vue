<template>
  <div>
    <b
      class="mp-block"
      v-text="translate(OPENING_HOURS)" />
    <div
      v-if="openingHours.length === 0"
      class="mp-content-between"
      v-text="translate(CLOSED)"></div>
    <div
      v-for="hours in openingHours"
      :key="hours.weekday"
      class="mp-content-between mp-gap-1 mp-grid mp-grid-cols-2">
      <span v-text="translate(hours.weekday)" />
      <span
        class="mp-text-nowrap"
        v-text="hours.timeString === CLOSED ? translate(CLOSED) : hours.timeString" />
    </div>
  </div>
</template>

<script
  lang="ts"
  setup>
import {computed, toValue, toRefs} from 'vue';
import {format} from 'date-fns';
import {OPENING_HOURS, CLOSED, type CarrierIdentifier} from '@myparcel-do/shared';
import {useLanguage, usePickupLocation} from '../../../../composables';

const { translate } = useLanguage();
const props = defineProps<{ locationCode: string; expanded?: boolean, carrierIdentifier: CarrierIdentifier }>();
const propRefs = toRefs(props);
const { pickupLocation } = usePickupLocation(propRefs.locationCode, propRefs.carrierIdentifier);

const weekDaysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const openingHours = computed(() => {
  const openingHoursData = toValue(pickupLocation)?.openingHours ?? [];
  return weekDaysMap.map((day, index) => {
    const dayData = openingHoursData.find((entry: { weekday: number }) => entry.weekday === index);

    if (dayData?.hours && dayData.hours.length > 0) {
      const times = dayData.hours[0];

      if (times.start && times.end) {
        const startTime = format(new Date(times.start.date), 'HH:mm');
        const endTime = format(new Date(times.end.date), 'HH:mm');
        const timeString = `${startTime} - ${endTime}`;
        return {
          weekday: day,
          timeString,
        };
      }
    }

    return {
      weekday: day,
      timeString: CLOSED,
    };
  });
});
</script>
