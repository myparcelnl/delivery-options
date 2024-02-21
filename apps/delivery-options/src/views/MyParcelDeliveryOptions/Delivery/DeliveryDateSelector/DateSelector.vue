<template>
  <div class="mp-flex mp-select-none">
    <div
      v-show="showNavigation"
      class="mp-flex mp-items-center mp-mr-2">
      <IconButton
        :disabled="loading || cursor <= 0"
        @click="previous">
        <CaretLeftIcon />
      </IconButton>
    </div>

    <component
      :is="loading ? Loader.Wrapper : 'div'"
      class="mp-auto-cols-fr mp-flex-grow mp-gap-2 mp-grid mp-grid-flow-col">
      <template v-if="loading">
        <DateBlock
          v-for="i in shownItems"
          :key="i" />
      </template>

      <DateBlock
        v-for="{date} in visibleDates"
        v-else
        :key="date"
        :class="{
          'mp-bg-blue-500 mp-border-blue-500': model === date,
        }"
        :date="date"
        @click="model = date" />
    </component>

    <div
      v-show="showNavigation"
      class="mp-flex mp-items-center mp-ml-2">
      <IconButton
        :disabled="loading || cursor >= dates.length - shownItems"
        @click="next">
        <CaretRightIcon />
      </IconButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch, toValue} from 'vue';
import {useVModel} from '@vueuse/core';
import {type TextInputEmits, type TextInputProps, type WithElement, Loader} from '@myparcel-do/shared';
import {useDeliveryOptionsForm} from '../../../../form';
import {FIELD_DELIVERY_DATE, DATES_SHOWN_MD, DATES_SHOWN_SM} from '../../../../data';
import {useBreakpoints, useResolvedDeliveryDates, useResolvedDeliveryOptions} from '../../../../composables';
import {CaretLeftIcon, CaretRightIcon, IconButton} from '../../../../components';
import DateBlock from './DateBlock.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<TextInputProps>>();
const emit = defineEmits<TextInputEmits>();

const model = useVModel(props, undefined, emit);

const deliveryOptions = useResolvedDeliveryOptions();
const dates = useResolvedDeliveryDates();
const form = useDeliveryOptionsForm();

const cursor = ref(0);

const {sm} = useBreakpoints();

const shownItems = computed(() => (sm.value ? DATES_SHOWN_SM : DATES_SHOWN_MD));
const visibleDates = computed(() => dates.value.slice(cursor.value, cursor.value + shownItems.value));
const loading = computed(() => toValue(deliveryOptions.loading));
const showNavigation = computed(() => dates.value.length > shownItems.value);

const previous = () => {
  if (cursor.value <= 0) {
    return;
  }

  cursor.value -= 1;
};

const next = () => {
  if (cursor.value >= dates.value.length - shownItems.value) {
    return;
  }

  cursor.value += 1;
};

watch(
  dates,
  (dates) => {
    model.value = dates[0]?.date;
  },
  {immediate: dates.value.length > 0},
);

watch(
  model,
  (value) => {
    form?.instance.setValue(FIELD_DELIVERY_DATE, value);
  },
  {immediate: dates.value.length > 0},
);
</script>
