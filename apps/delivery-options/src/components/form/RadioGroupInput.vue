<template>
  <div>
    <RadioInput
      v-for="option in element.props.options"
      :key="option.value"
      :element="element"
      :label="option.label"
      :model-value="model[option.value]"
      @change="model = option.value" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {useVModel} from '@vueuse/core';
import {type ElementEmits, type ElementProps} from '@myparcel-do/shared';
import RadioInput from './RadioInput.vue';

const props = defineProps<ElementProps<string>>();
const emit = defineEmits<ElementEmits<string>>();

const propRefs = toRefs(props);
const model = useVModel(propRefs.modelValue, undefined, emit);
</script>
