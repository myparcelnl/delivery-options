<template>
  <ul>
    <li
      v-for="option in options"
      :key="option.value">
      <label class="mp-flex mp-gap-2">
        <RadioInput
          v-model="model"
          :disabled="disabled"
          :readonly="readonly"
          :value="option.value"
          type="radio" />

        <span v-text="translate(option.label)" />
      </label>
    </li>
  </ul>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type RadioGroupEmits, type RadioGroupModelValue, type RadioGroupProps, RadioInput} from '@myparcel-dev/do-shared';
import {useLanguage} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<RadioGroupProps<T>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const model = useVModel(props, undefined, emit);

const {translate} = useLanguage();
</script>
