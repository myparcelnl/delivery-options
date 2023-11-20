<template>
  <select
    :id="id"
    v-model="model">
    <option
      v-for="option in options"
      :key="option.value"
      :disabled="elementProps.disabled || option.disabled"
      :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type ElementEmits, type ElementProps, useElementContext} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<string>>();
const emit = defineEmits<ElementEmits<string>>();

const {id, model, elementProps} = useElementContext(props, emit);

const options = computed(() => props.element.props.options);
</script>
