<template>
  <Datepicker
    v-model.lazy.number="model"
    :disabled-dates="disablePastAndToday"
    :enable-time-picker="false"
    class="datepicker"
    multi-dates />
</template>

<script lang="ts" setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const model = defineModel<Date[]>();

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
