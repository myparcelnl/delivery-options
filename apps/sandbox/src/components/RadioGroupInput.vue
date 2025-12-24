<template>
  <div>
    <label
      v-for="option in options"
      :key="`${option.value}`"
      class="mp-flex mp-gap-2 mp-items-center mp-py-1">
      <RadioInput
        v-model="model"
        :value="option.value"
        type="radio" />

      <span v-text="translate(option.label)" />
    </label>
  </div>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {
  type RadioGroupModelValue,
  RadioInput,
  type SelectOption,
} from '@myparcel-dev/do-shared';
import {useLanguage} from '../composables';

interface Props {
  options: SelectOption[];
}

const props = defineProps<Props>();

const model = defineModel<T>();

const {translate} = useLanguage();
</script>
