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
import {Loader} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../../../../stores';
import {DATES_SHOWN_MD, DATES_SHOWN_SM} from '../../../../data';
import {
  useBreakpoints,
  useResolvedDeliveryDates,
  useResolvedDeliveryOptions,
  useSelectedValues,
} from '../../../../composables';
import {CaretLeftIcon, CaretRightIcon, IconButton} from '../../../../components';
import DateBlock from './DateBlock.vue';

const model = defineModel<string>();

const deliveryOptions = useResolvedDeliveryOptions();
const dates = useResolvedDeliveryDates();
const {state: config} = useConfigStore();
const {carrier, deliveryDate} = useSelectedValues();

const cursor = ref(0);

const {sm} = useBreakpoints();

const shownItems = computed(() => (sm.value ? DATES_SHOWN_SM : DATES_SHOWN_MD));

/**
 * In compact-view mode with a selected carrier, hide dates that have no options
 * for that carrier. Outside compact mode (or before any carrier is picked), all
 * dates remain visible.
 */
const filteredDates = computed(() => {
  if (config.compactView && carrier.value) {
    const selected = carrier.value;
    return dates.value.filter((option) =>
      deliveryOptions.value.some((moment) => moment.date === option.date && moment.carrier === selected),
    );
  }

  return dates.value;
});

const visibleDates = computed(() => filteredDates.value.slice(cursor.value, cursor.value + shownItems.value));
const loading = computed(() => toValue(deliveryOptions.loading));
const showNavigation = computed(() => filteredDates.value.length > shownItems.value);

const previous = () => {
  if (cursor.value <= 0) {
    return;
  }

  cursor.value -= 1;
};

const next = () => {
  if (cursor.value >= filteredDates.value.length - shownItems.value) {
    return;
  }

  cursor.value += 1;
};

watch(
  filteredDates,
  (dates) => {
    model.value = dates[0]?.date;
    cursor.value = 0;
  },
  {immediate: filteredDates.value.length > 0},
);

watch(
  model,
  (value) => {
    deliveryDate.value = value;
  },
  {immediate: filteredDates.value.length > 0},
);
</script>
