<template>
  <div>
    <div
      v-for="(option, index) in options"
      :key="`${id}-${option.value}`"
      :class="`myparcel-${option.value}`">
      <OptionRow
        v-model="model"
        :option="option"
        class="mp-py-2">
        <template #label>
          <h3
            class="mp-my-auto"
            v-text="option.label" />
        </template>

        <RadioInput
          v-model="model"
          :value="option.value"
          type="radio" />
      </OptionRow>

      <KeepAlive>
        <component
          :is="option.content"
          v-if="model === option.value && option.content"
          class="mp-pl-4 mp-pt-4" />
      </KeepAlive>

      <hr v-if="index < options.length - 1" />
    </div>
  </div>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {
  type RadioGroupEmits,
  type RadioGroupModelValue,
  type RadioGroupProps,
  RadioInput,
  useRadioGroupContext,
  type WithElement,
} from '@myparcel-do/shared';
import OptionRow from '../OptionRow/OptionRow.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options} = useRadioGroupContext(props, emit);
</script>
