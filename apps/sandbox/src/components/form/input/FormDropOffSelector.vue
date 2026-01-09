<template>
  <SandboxCheckboxGroupInput
    v-model="days"
    :options="weekdayOptions"
    class="mp-flex-grow">
    <template #default="{option}">
      <div
        v-show="days?.includes(option.value)"
        class="mp-mt-2 mp-w-full">
        <FieldWrapper :field="{key: `cutoffTime[${option.value}]`}">
          <template #label>{{ translate('option_cutoffTime') }}</template>
          <FormTimeInput
            :name="`cutoffTime[${option.value}]`"
            v-model="cutoffTimes[Number(option.value) as Weekday].value"/>
        </FieldWrapper>

        <FieldWrapper :field="{key: `cutoffTimeSameDay[${option.value}]`}">
          <template #label>{{ translate('option_cutoffTimeSameDay') }}</template>
          <FormTimeInput
            :name="`cutoffTimeSameDay[${option.value}]`"
            v-model="sameDayCutoffTimes[Number(option.value) as Weekday].value"/>
        </FieldWrapper>
      </div>
    </template>
    </SandboxCheckboxGroupInput>
</template>

<script lang="ts" setup>
import {computed, onUnmounted, reactive, ref, toRefs, watch, type Ref} from 'vue';
import {SandboxCheckboxGroupInput} from '../../base';
import {useWeekdays} from '../../../composables';
import { DROP_OFF_CUTOFF_TIME, DROP_OFF_SAME_DAY_CUTOFF_TIME, DROP_OFF_WEEKDAY, type DropOffEntry, type DropOffEntryObject, type SelectOption, type Translatable, type Weekday } from '@myparcel-dev/do-shared';
import FormTimeInput from './FormTimeInput.vue';
import FieldWrapper from '../../FieldWrapper.vue';
import { useLanguage } from '../../../composables/useLanguage';

const {translate} = useLanguage();

// The model contains the selected weekdays AND each days' cutoff and cutoff-same-day times.
const model = defineModel<DropOffEntryObject[]>();

// Track selected days and corresponding cutoff times separately for easier binding.
const days = ref(model.value?.map((entry) => String(entry[DROP_OFF_WEEKDAY])));
const weekdays = useWeekdays();
const weekdayOptions = computed<SelectOption[]>(() =>
  weekdays.value.map((weekday, index) => ({
    label: weekday,
    value: String(index),
  })),
);

/**
 * Create weekday objects for storing cutoff times.
 * @param key the key in which the cutoff time is tracked in the model value
 * @param defaultValue
 */
const createWeekdaysObject = (
  key: keyof Omit<DropOffEntryObject, 'weekday'>, defaultValue: string
): Record<Weekday, Ref<string>> => {
  return weekdays.value.reduce((acc, _, weekday) => {
      // Find the current value for the "key" for each weekday and populate the ref with it, or the default value.
      const value = model.value?.find((entry) => entry[DROP_OFF_WEEKDAY] === weekday)?.[key];
      console.log(value);
      acc[Number(weekday) as Weekday] = ref(value ?? defaultValue);
      return acc;
    }, {} as Record<Weekday, Ref<string>>);
};

const cutoffTimes = createWeekdaysObject(DROP_OFF_CUTOFF_TIME, '16:00');
const sameDayCutoffTimes = createWeekdaysObject(DROP_OFF_SAME_DAY_CUTOFF_TIME, '09:00');

/** Watch the days, cutoff times, and same-day cutoff times to update the model accordingly. */
const stop = watch([days, ...Object.values(cutoffTimes), ...Object.values(sameDayCutoffTimes)], () => {
  model.value = days.value?.map((weekday) => ({
    [DROP_OFF_WEEKDAY]: Number(weekday) as Weekday,
    [DROP_OFF_CUTOFF_TIME]: cutoffTimes[Number(weekday) as Weekday].value,
    [DROP_OFF_SAME_DAY_CUTOFF_TIME]: sameDayCutoffTimes[Number(weekday) as Weekday].value,
  }));
});

onUnmounted(stop);
</script>
