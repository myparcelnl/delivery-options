<template>
  <SandboxToggleInput
    v-model="model"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type ToggleInputEmits, type ToggleInputProps, useElementContext, type WithElement} from '@myparcel-do/shared';
import SandboxToggleInput from '../base/SandboxToggleInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<ToggleInputProps>>();
const emit = defineEmits<ToggleInputEmits>();

const {model, elementProps} = useElementContext(props, emit);
</script>
