<template>
  <DateSelector
    v-show="showDeliveryDate"
    v-model="deliveryDate" />
</template>

<script lang="ts" setup>
import {useFeatures, useSelectedValues} from '../../../../composables';
import DateSelector from './DateSelector.vue';

const {deliveryDate} = useSelectedValues();

const {showDeliveryDate} = useFeatures();
</script>
