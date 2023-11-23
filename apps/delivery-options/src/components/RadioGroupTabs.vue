<template>
  <div
    v-for="option in options"
    :key="`${id}-${option.value}`"
    :class="`myparcel-${option.value}`">
    <RadioInputRow
      v-model="model"
      :option="option"
      class="mp-py-2">
      <template #label>
        <h3
          class="mp-my-auto"
          v-text="option.label" />
      </template>
    </RadioInputRow>

    <KeepAlive>
      <component
        :is="option.content"
        v-if="model === option.value && option.content"
        class="mp-p-4" />
    </KeepAlive>
  </div>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {type Component} from 'vue';
import {
  type RadioGroupEmits,
  type RadioGroupModelValue,
  type RadioGroupProps,
  RadioInputRow,
  useRadioGroupContext,
  type WithElement,
} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);
</script>
