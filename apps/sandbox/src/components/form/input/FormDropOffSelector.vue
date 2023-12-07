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
import {
  CarrierSetting,
  type DropOffEntry,
  type ElementEmits,
  type ElementProps,
  type SelectOption,
  useWeekdays,
} from '@myparcel-do/shared';
import {createField, type InteractiveElementConfiguration} from '@myparcel/vue-form-builder';
import {SandboxCheckboxGroupInput} from '../../base';
import FormTimeInput from './FormTimeInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<DropOffEntry[]>>();
const emit = defineEmits<ElementEmits<DropOffEntry[]>>();

type InternalEntryObject = Record<number, Omit<DropOffEntry, 'day'>>;

const model = computed<InternalEntryObject>({
  get() {
    return props.modelValue.reduce((acc, entry) => {
      acc[entry.day] = entry;

      return acc;
    }, {});
  },

  set(value: InternalEntryObject) {
    const entries = Object.entries(value).map(([day, entry]) => ({...(entry as DropOffEntry), day: Number(day)}));

    emit('update:modelValue', entries);
  },
});

const weekdays = useWeekdays();

const days = ref(props.modelValue.map((entry) => String(entry.day)));

const createWeekdaysObject = (defaultValue: string) => {
  return reactive(
    weekdays.value.reduce((acc, _, index) => {
      acc[index] = ref(defaultValue);
      return acc;
    }, {}),
  );
};

const cutoffTimes = toRefs(createWeekdaysObject('16:00'));
const sameDayCutoffTimes = toRefs(createWeekdaysObject('09:00'));

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
      label: CarrierSetting.CutoffTime,
      name: `${CarrierSetting.CutoffTime}-${index}`,
      ref: cutoffTimes[index],
    }),

    createField({
      ...common,
      label: CarrierSetting.CutoffTimeSameDay,
      name: `${CarrierSetting.CutoffTimeSameDay}-${index}`,
      ref: sameDayCutoffTimes[index],
    }),
  ];
});

const stop = watch([days, ...Object.values(cutoffTimes), ...Object.values(sameDayCutoffTimes)], () => {
  model.value = days.value.map((day) => ({
    day,
    [CarrierSetting.CutoffTime]: cutoffTimes[day].value,
    [CarrierSetting.CutoffTimeSameDay]: sameDayCutoffTimes[day].value,
  }));
});

onUnmounted(stop);
</script>
