<template>
  <input
    :id="id"
    v-model.lazy.trim="model"
    :class="classes"
    :disabled="disabled"
    :name="name"
    :readonly="readonly"
    type="text" />
</template>

<script generic="T" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type TextInputEmits, type TextInputProps} from '@myparcel-do/shared';
import {useBaseInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();
const emit = defineEmits<TextInputEmits>();

const model = useVModel(props, undefined, emit);

const classes = useBaseInputClasses();
</script>
