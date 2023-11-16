<template>
  <input
    :id="id"
    v-model="model"
    :disabled="element.isDisabled || element.isSuspended || element.isReadOnly"
    :readonly="element.isReadOnly"
    :value="element.props.value"
    type="checkbox" />
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type ElProps,
  useElementContext,
} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<CheckboxGroupProps<T>>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {id, model} = useElementContext(props, emit);
</script>
