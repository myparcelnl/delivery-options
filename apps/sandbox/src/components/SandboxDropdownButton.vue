<template>
  <div class="mp-flex-grow-0 mp-group mp-inline-flex mp-relative">
    <CButton
      :size="size"
      :variant="variant"
      class="group-hover:mp-rounded-b-none">
      <slot>
        {{ currentItem.label }}
      </slot>
    </CButton>

    <div
      class="group-hover:mp-flex mp-absolute mp-flex-col mp-hidden mp-min-w-full mp-overflow-hidden mp-right-0 mp-rounded-b-[20px] mp-shadow-lg mp-top-full mp-z-20">
      <CButton
        v-for="item in options"
        :key="item.value"
        :size="size"
        :variant="variant"
        class="mp-rounded-none"
        @click="() => (model = item.value)">
        {{ item.label }}
      </CButton>
    </div>
  </div>
</template>

<script generic="T " lang="ts" setup>
import {computed} from 'vue';
import {get, useVModel} from '@vueuse/core';
import {type SelectOption} from '@myparcel-do/shared';
import {type StyleProps} from '../types';
import CButton from './CButton.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<StyleProps & {options: SelectOption<T>[]; modelValue: T}>();
const emit = defineEmits<(event: 'update:modelValue', value: T) => void>();

const model = useVModel(props, undefined, emit);

const currentItem = computed<SelectOption<T>>(() => {
  const match = props.options.find((item) => item.value === get(model));

  return match ?? props.options[0];
});
</script>
