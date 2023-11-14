<template>
  <select v-model="model">
    <option
      v-for="option in element.options"
      :key="option.value"
      :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {useVModel} from '@vueuse/core';
import {type InteractiveElementInstance} from '@myparcel/vue-form-builder';

const props = defineProps<{
  element: InteractiveElementInstance;
  modelValue: string;
}>();

const propRefs = toRefs(props);

const emit = defineEmits<{
  'update:modelValue': (value: string) => void;
}>();

const model = useVModel(propRefs.modelValue, undefined, emit);
</script>
