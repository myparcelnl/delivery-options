<template>
  <SandboxCheckboxGroupInput
    v-model="days"
    :options="weekdayOptions"
    class="mp-flex-grow">
    <template #default="{option}">
      <div
        v-show="days.includes(option.value)"
        class="mp-mt-2 mp-w-full">
        <component
          :is="component.Component"
          v-for="component in nestedComponents[option.value]"
          :key="component.field.name" />
      </div>
    </template>
  </SandboxCheckboxGroupInput>
</template>

<script lang="ts" setup>
import {computed, markRaw, onUnmounted, reactive, ref, toRefs, watch} from 'vue';
import {get} from '@vueuse/core';
import {type DropOffEntry, type ElementEmits, type ElementProps, type SelectOption} from '@myparcel-do/shared';
import {createField, type InteractiveElementConfiguration} from '@myparcel/vue-form-builder';
import {SandboxCheckboxGroupInput} from '../../base';
import {useLanguage, useWeekdays} from '../../../composables';
import FormTimeInput from './FormTimeInput.vue'; // eslint-disable-next-line vue/no-unused-properties

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<DropOffEntry[]>>();
const emit = defineEmits<ElementEmits<DropOffEntry[]>>();

type InternalEntryObject = Record<number, Omit<DropOffEntry, 'day'>>;

const CUTOFF_TIME = 'cutoffTime';
const CUTOFF_TIME_SAME_DAY = 'cutoffTimeSameDay';

const model = computed<InternalEntryObject>({
  get() {
    return props.modelValue.reduce((acc, entry) => {
      acc[entry.day] = entry;

      return acc;
    }, {});
  },

  set(entries: DropOffEntry[]) {
    emit('update:modelValue', entries);
  },
});

const language = useLanguage();

const weekdays = useWeekdays(language.language.value.code);

const createWeekdaysObject = (key: string, defaultValue: string) => {
  return reactive(
    weekdays.value.reduce((acc, _, weekday) => {
      const value = props.modelValue.find((entry) => entry.day === String(weekday))?.[key];

      acc[weekday] = ref(value ?? defaultValue);
      return acc;
    }, {}),
  );
};

const days = ref(props.modelValue.map((entry) => String(entry.day)));
const cutoffTimes = toRefs(createWeekdaysObject(CUTOFF_TIME, '16:00'));
const sameDayCutoffTimes = toRefs(createWeekdaysObject(CUTOFF_TIME_SAME_DAY, '09:00'));

const weekdayOptions = computed<SelectOption[]>(() =>
  weekdays.value.map((weekday, index) => ({
    label: weekday,
    value: String(index),
  })),
);

const nestedComponents = weekdays.value.map((weekday, index) => {
  const common: Partial<InteractiveElementConfiguration> = {
    component: markRaw(FormTimeInput),
    visibleWhen: () => get(days).includes(String(index)),
    disabledWhen: () => !get(days).includes(String(index)),
  };

  return [
    createField({
      ...common,
      label: CUTOFF_TIME,
      name: `${CUTOFF_TIME}-${index}`,
      ref: cutoffTimes[index],
    }),

    createField({
      ...common,
      label: CUTOFF_TIME_SAME_DAY,
      name: `${CUTOFF_TIME_SAME_DAY}-${index}`,
      ref: sameDayCutoffTimes[index],
    }),
  ];
});

const stop = watch([days, ...Object.values(cutoffTimes), ...Object.values(sameDayCutoffTimes)], () => {
  model.value = days.value.map((day) => ({
    day,
    cutoffTime: cutoffTimes[day].value,
    cutoffTimeSameDay: sameDayCutoffTimes[day].value,
  }));
});

onUnmounted(stop);
</script>
