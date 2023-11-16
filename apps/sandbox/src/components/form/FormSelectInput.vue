<template>
  <select
    v-model="model"
    :class="classes"
    v-bind="elementProps">
    <option
      v-for="option in element.props.options"
      :key="`${id}_${option.value}`"
      :value="option.value"
      v-text="option.label" />
  </select>
</template>

<script lang="ts" setup>
import {type ElementEmits, type ElementProps, useElementContext} from '@myparcel-do/shared';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<string>>();
const emit = defineEmits<ElementEmits<string>>();

const {id, model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
