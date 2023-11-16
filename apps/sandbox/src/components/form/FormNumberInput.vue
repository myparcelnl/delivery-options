<template>
  <NumberInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type ElProps, type NumberInputEmits, type NumberInputProps, useElementContext} from '@myparcel-do/shared';
import NumberInput from '../base/NumberInput.vue';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<NumberInputProps>>();
const emit = defineEmits<NumberInputEmits>();

const {model, elementProps} = useElementContext(props, emit);
const classes = useElInputClasses();
</script>
