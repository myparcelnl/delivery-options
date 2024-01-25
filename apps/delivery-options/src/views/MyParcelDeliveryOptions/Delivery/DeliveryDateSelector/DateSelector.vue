<template>
  <div class="mp-flex">
    <div class="mp-flex mp-items-center mp-mr-2">
      <DoButton
        :disabled="cursor <= 0"
        class="mp-flex-grow-0"
        @click="previous">
        <CaretLeftIcon />
      </DoButton>
    </div>

    <div class="mp-auto-cols-fr mp-flex-grow mp-gap-2 mp-grid mp-grid-flow-col">
      <DateBlock
        v-for="{date} in visibleDates"
        :key="date"
        :active="model === date"
        :date="date"
        @click="model = date" />
    </div>

    <div class="mp-flex mp-items-center mp-ml-2">
      <DoButton
        :disabled="cursor >= dates.length - shownItems"
        class="mp-flex-grow-0"
        @click="next">
        <CaretRightIcon />
      </DoButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useVModel} from '@vueuse/core';
import {type TextInputEmits, type TextInputProps} from '@myparcel-do/shared';
import {useDeliveryOptionsForm} from '../../../../form';
import {FIELD_DELIVERY_DATE} from '../../../../data';
import {useBreakpoints, useResolvedDeliveryDates} from '../../../../composables';
import {CaretLeftIcon, CaretRightIcon, DoButton} from '../../../../components';
import DateBlock from './DateBlock.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();
const emit = defineEmits<TextInputEmits>();

const model = useVModel(props, undefined, emit);

const dates = useResolvedDeliveryDates();
const form = useDeliveryOptionsForm();

const cursor = ref(0);

const width = useBreakpoints();

const shownItems = computed(() => (width.sm.value ? 2 : 4));

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

const visibleDates = computed(() => dates.value.slice(cursor.value, cursor.value + shownItems.value));

watch(
  [dates, model],
  ([dates, value]) => {
    if (!dates?.length) {
      return;
    }

    if (!value) {
      model.value = dates[0]?.date;
      return;
    }

    form?.instance.setValue(FIELD_DELIVERY_DATE, value);
  },
  {immediate: dates.value.length > 0},
);
</script>
