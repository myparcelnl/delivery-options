<template>
  <SandboxCheckboxGroupInput
    v-model="days"
    :options="weekdayOptions"
    class="mp-flex-grow" />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {SandboxCheckboxGroupInput} from '../../base';
import {useWeekdays} from '../../../composables';

const model = defineModel<any[]>();

const {weekdayOptions} = useWeekdays();

const days = ref<number[]>([]);
</script>
