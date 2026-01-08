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

<script lang="ts" setup>
import {type TextInputEmits, type TextInputProps} from '@myparcel-dev/do-shared';
import {useBaseInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();

const model = defineModel<string|number>();

const classes = useBaseInputClasses();
</script>
