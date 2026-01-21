<template>
  <textarea
    :id="id"
    v-model="model"
    :class="classes" />
</template>

<script lang="ts" setup>
import {type TextInputProps} from '@myparcel-dev/do-shared';
import {useBaseInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();

const model = defineModel<string>();

const classes = useBaseInputClasses();
</script>
