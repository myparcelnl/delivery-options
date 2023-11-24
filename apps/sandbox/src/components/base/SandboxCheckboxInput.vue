<template>
  <label
    :class="{
      'mp-opacity-50': disabled,
    }"
    class="mp-cursor-pointer mp-flex mp-items-center">
    <input
      v-model="model"
      :disabled="disabled"
      :readonly="readonly"
      :value="value"
      class="mp-sr-only"
      type="checkbox" />

    <span
      :class="{
        'mp-border-gray-300 dark:mp-border-gray-400': !checked,
        'mp-bg-goldfish-500 mp-border-goldfish-500': checked,
      }"
      class="mp-border mp-h-5 mp-inline-block mp-pointer-events-none mp-relative mp-rounded mp-transition mp-w-5">
      <span class="mp-absolute mp-h-full mp-inset-0 mp-rounded-sm mp-transition mp-w-full">
        <svg
          v-if="checked"
          class="mp-fill-white mp-h-full mp-inset-0 mp-w-full"
          viewBox="0 0 20 20">
          <path
            clip-rule="evenodd"
            d="M4.70711 10.2929C4.31658 9.90237 3.68342 9.90237 3.29289 10.2929C2.90237 10.6834 2.90237 11.3166 3.29289 11.7071L7.29289 15.7071C7.68342 16.0976 8.31658 16.0976 8.70711 15.7071L16.7071 7.70711C17.0976 7.31658 17.0976 6.68342 16.7071 6.29289C16.3166 5.90237 15.6834 5.90237 15.2929 6.29289L8 13.5858L4.70711 10.2929Z"
            fill-rule="evenodd" />
        </svg>
      </span>
    </span>

    <span class="mp-ml-2">
      <slot />
    </span>
  </label>
</template>

<script generic="T extends CheckboxModelValue" lang="ts" setup>
import {computed} from 'vue';
import {useVModel} from '@vueuse/core';
import {type CheckboxEmits, type CheckboxModelValue, type CheckboxProps} from '@myparcel-do/shared'; // eslint-disable-next-line vue/no-unused-properties

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CheckboxProps<T>>();
const emit = defineEmits<CheckboxEmits<T>>();

const model = useVModel(props, undefined, emit);

const checked = computed(() => {
  if (typeof model.value === 'boolean') {
    return model.value;
  }

  return model.value.includes(props.value);
});
</script>
