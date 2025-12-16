<template>
  <Datepicker
    v-model.lazy.number="model"
    :disabled-dates="disablePastAndToday"
    :enable-time-picker="false"
    class="datepicker"
    multi-dates
    v-bind="elementProps"></Datepicker>
</template>

<script lang="ts" setup>
import Datepicker from '@vuepic/vue-datepicker';
import {
  type MultiDateSelectProps,
  type MultiDateSelectEmits,
  useElementContext,
  type WithElement,
} from '@myparcel-dev/do-shared';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<WithElement<MultiDateSelectProps>>();
const emit = defineEmits<MultiDateSelectEmits>();

const {model, elementProps} = useElementContext(props, emit);

const disablePastAndToday = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
};
</script>

<style>
.datepicker {
  max-width: 400px;
}
</style>
