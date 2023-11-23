<template>
  <SandboxTextAreaInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type TextAreaEmits, type TextAreaProps, useElementContext, type WithElement} from '@myparcel-do/shared';
import SandboxTextAreaInput from '../base/SandboxTextAreaInput.vue';
import {useElInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<TextAreaProps>>();
const emit = defineEmits<TextAreaEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
