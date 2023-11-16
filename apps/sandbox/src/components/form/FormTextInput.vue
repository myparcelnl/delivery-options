<template>
  <TextInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type ElProps, type TextInputEmits, type TextInputProps, useElementContext} from '@myparcel-do/shared';
import TextInput from '../base/TextInput.vue';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<TextInputProps>>();
const emit = defineEmits<TextInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
