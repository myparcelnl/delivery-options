<template>
  <ToggleInput
    v-model="model"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type ElProps, type ToggleInputEmits, type ToggleInputProps, useElementContext} from '@myparcel-do/shared';
import ToggleInput from '../base/ToggleInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<ToggleInputProps>>();
const emit = defineEmits<ToggleInputEmits>();

const {model, elementProps} = useElementContext(props, emit);
</script>
