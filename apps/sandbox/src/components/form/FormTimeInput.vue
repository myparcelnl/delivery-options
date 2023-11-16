<template>
  <TimeInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type ElProps, type TimeInputEmits, type TimeInputProps, useElementContext} from '@myparcel-do/shared';
import TimeInput from '../base/TimeInput.vue';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<TimeInputProps>>();
const emit = defineEmits<TimeInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
