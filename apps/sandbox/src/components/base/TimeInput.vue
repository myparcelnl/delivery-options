<template>
  <TextInput
    v-model="model"
    type="time"
    v-bind="$props" />
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type TimeInputEmits, type TimeInputProps} from '@myparcel-do/shared';
import TextInput from './TextInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TimeInputProps>();
const emit = defineEmits<TimeInputEmits>();

const model = useVModel(props, undefined, emit);
</script>
