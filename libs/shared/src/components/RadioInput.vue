<template>
  <input
    :id="id"
    v-model="model"
    :disabled="disabled"
    :name="name"
    :readonly="readonly"
    type="radio" />
</template>

<script generic="T extends RadioModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type RadioEmits, type RadioModelValue, type RadioProps} from '../types';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<RadioProps<T>>();
const emit = defineEmits<RadioEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>
