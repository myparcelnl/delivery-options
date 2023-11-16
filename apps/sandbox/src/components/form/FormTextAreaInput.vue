<template>
  <TextAreaInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type ElProps, type TextAreaEmits, type TextAreaProps, useElementContext} from '@myparcel-do/shared';
import TextAreaInput from '../base/TextAreaInput.vue';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<TextAreaProps>>();
const emit = defineEmits<ElProps<TextAreaEmits>>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
