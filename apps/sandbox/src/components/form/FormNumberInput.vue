<template>
  <NumberInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type NumberInputEmits, type NumberInputProps, useElementContext, type WithElement} from '@myparcel-do/shared';
import NumberInput from '../base/NumberInput.vue';
import {useElInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<NumberInputProps>>();
const emit = defineEmits<NumberInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>
