<template>
  <textarea
    :id="id"
    v-model="model"
    :class="classes" />
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type TextAreaEmits, type TextAreaProps} from '@myparcel-dev/shared';
import {useBaseInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextAreaProps>();
const emit = defineEmits<TextAreaEmits>();

const model = useVModel(props, undefined, emit);

const classes = useBaseInputClasses();
</script>
