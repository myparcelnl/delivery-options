<template>
  <SandboxTimeInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type TimeInputEmits, type TimeInputProps, useElementContext, type WithElement} from '@myparcel-do/shared';
import SandboxTimeInput from '../../base/SandboxTimeInput.vue';
import {useElInputClasses} from '../../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<TimeInputProps>>();
const emit = defineEmits<TimeInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
