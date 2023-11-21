<template>
  <SelectInput
    :id="id"
    v-model="model"
    :class="classes"
    :options="options"
    v-bind="allElementProps" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type ElementEmits, type ElementProps, type SelectOption, useElementContext} from '@myparcel-do/shared';
import SelectInput from '../base/SelectInput.vue';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<string>>();
const emit = defineEmits<ElementEmits<string>>();

const {id, model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();

const options = computed(() => (props.element.props.options ?? []) as SelectOption[]);

const allElementProps = computed(() => {
  const {options, ...rest} = elementProps.value;

  return rest;
});
</script>
