<template>
  <ul>
    <li
      v-for="option in options"
      :key="option.value">
      <label class="mp-gap-4 mp-grid mp-grid-flow-col">
        <RadioInput
          v-model="model"
          :disabled="disabled"
          :name="`${id}[${option.value}]`"
          :readonly="readonly"
          :value="option.value"
          type="radio" />

        <span v-text="option.label" />
      </label>
    </li>
  </ul>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type RadioGroupEmits, type RadioGroupModelValue, type RadioGroupProps, RadioInput} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<RadioGroupProps<T>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>
