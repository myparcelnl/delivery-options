<template>
  <SandboxTextInput
    v-model.lazy.trim="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type TextInputEmits, type TextInputProps, useElementContext, type WithElement} from '@myparcel-do/shared';
import SandboxTextInput from '../../base/SandboxTextInput.vue';
import {useElInputClasses} from '../../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<TextInputProps>>();
const emit = defineEmits<TextInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
