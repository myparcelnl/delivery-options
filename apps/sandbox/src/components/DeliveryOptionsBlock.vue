<template>
  <MyParcelDeliveryOptions
    v-if="parsedConfiguration"
    :configuration="parsedConfiguration" />
</template>

<script lang="ts" setup>
import {computed, markRaw, reactive} from 'vue';
import {ComponentName} from '@myparcel-do/shared';
import {CheckboxGroupInput, MyParcelDeliveryOptions} from '@myparcel/delivery-options/ts';
import {useSandboxStore} from '../stores';
import RadioGroupInput from './RadioGroupInput.vue';

const store = useSandboxStore();

const parsedConfiguration = computed(() => {
  return reactive({
    ...store.resolvedConfiguration,
    components: {
      [ComponentName.RadioGroup]: markRaw(RadioGroupInput),
      [ComponentName.CheckboxGroup]: markRaw(CheckboxGroupInput),
    },
  });
});
</script>
