<template>
  <div>
    <b
      class="mp-block"
      v-text="translate(OPENING_HOURS)" />

    <div
      v-for="hours in filteredOpeningHours"
      :key="hours.weekday"
      class="mp-content-between mp-gap-1 mp-grid mp-grid-cols-2">
      <span v-text="hours.weekday" />
      <span
        class="mp-text-nowrap"
        v-text="hours.timeString" />
    </div>

    <DoButton
      v-if="!resolvedShowAll"
      link
      @click="mutableShowAll = true">
      {{ translate(SHOW_MORE_HOURS) }}
    </DoButton>
  </div>
</template>

<script lang="ts" setup>
import {capitalize, computed, onDeactivated, ref, toRefs} from 'vue';
import {addDays, isSameDay, isToday} from 'date-fns';
import {CLOSED, OPENING_HOURS, SHOW_MORE_HOURS} from '@myparcel-do/shared';
import {type StartEndDate} from '@myparcel/sdk';
import {createNextDate, createUtcDate} from '../../../../utils';
import {SHOWN_OPENING_HOURS} from '../../../../data';
import {useDateFormat, useLanguage, usePickupLocation, useTimeRange} from '../../../../composables';
import DoButton from '../../../../components/common/DoButton/DoButton.vue';

const props = defineProps<{locationCode: string; expanded?: boolean}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const pickupLocation = usePickupLocation(propRefs.locationCode);

const mutableShowAll = ref(false);
const resolvedShowAll = computed(() => props.expanded || mutableShowAll.value);

const openingHours = computed(() => {
  return (pickupLocation.value?.openingHours ?? [])
    .map(({hours, weekday}) => {
      const date = createNextDate(weekday);
      const formattedDay = useDateFormat(date);

      const isTodayOrTomorrow = isToday(date) || isSameDay(addDays(createUtcDate(), 1), date);

      const time: StartEndDate = hours?.[0];
      const timeString = time ? useTimeRange(time.start.date, time.end.date).value : translate(CLOSED);

      return {
        date,
        weekday: capitalize(isTodayOrTomorrow ? formattedDay.relative.value : formattedDay.weekday.value),
        timeString,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
});

const filteredOpeningHours = computed(() => {
  return resolvedShowAll.value ? openingHours.value : openingHours.value.slice(0, SHOWN_OPENING_HOURS);
});

onDeactivated(() => {
  mutableShowAll.value = false;
});
</script>
