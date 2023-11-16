<template>
  <input
    :id="id"
    v-model="model"
    :class="classes"
    type="text"
    v-bind="$props" />
</template>

<script generic="T" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type TextInputEmits, type TextInputProps} from '@myparcel-do/shared';
import {useBaseInputClasses} from '../../composables/useBaseInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();
const emit = defineEmits<TextInputEmits>();

const model = useVModel(props, undefined, emit);

const classes = useBaseInputClasses();
</script>
