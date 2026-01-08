<template>
  <input
    v-model="model"
    v-bind="props" />
</template>

<script lang="ts" setup>
import {type TextInputEmits, type TextInputProps} from '../types';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();
const model = defineModel<string|number>();
</script>
