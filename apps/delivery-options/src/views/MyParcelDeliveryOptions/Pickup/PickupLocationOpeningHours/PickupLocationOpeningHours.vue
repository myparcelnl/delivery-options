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
      <span v-text="hours.weekday" />
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
import {format, setDay} from 'date-fns';
import {OPENING_HOURS, CLOSED, type CarrierIdentifier} from '@myparcel-do/shared';
import {useLanguage, usePickupLocation, useDateFormat} from '../../../../composables';

/**
 * Returns the localized name of a weekday for a given index (0 = Sunday, 1 = Monday, ...).
 */
const getLocalizedWeekdayName = (weekdayIndex: number): string => {
  const date = setDay(new Date(), weekdayIndex, {weekStartsOn: 0});
  const name = useDateFormat(date).weekday;
  return name.value;
};

const { translate } = useLanguage();
const props = defineProps<{ locationCode: string; expanded?: boolean, carrierIdentifier: CarrierIdentifier }>();
const propRefs = toRefs(props);
const { pickupLocation } = usePickupLocation(propRefs.locationCode, propRefs.carrierIdentifier);

const openingHours = computed(() => {
  const openingHoursData = toValue(pickupLocation)?.openingHours ?? [];
  return Array.from({length: 7}).map((_, weekdayIndex) => {
    const localizedWeekday = getLocalizedWeekdayName(weekdayIndex);
    const dayData = openingHoursData.find((entry: { weekday: number }) => entry.weekday === weekdayIndex);

    let timeString = CLOSED;

    if (dayData?.hours?.length) {
      const {start, end} = dayData.hours[0];

      if (start && end) {
        const startTime = format(new Date(start.date), 'HH:mm');
        const endTime = format(new Date(end.date), 'HH:mm');
        timeString = `${startTime} - ${endTime}`;
      }
    }

    return {
      weekday: localizedWeekday,
      timeString,
    };
  });
});
</script>
