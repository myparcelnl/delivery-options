<template>
  <TextInput
    :id="id"
    v-model.lazy="model"
    :disabled="disabled"
    :name="name"
    :readonly="readonly"
    type="time" />
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type TimeInputEmits, type TimeInputProps} from '@myparcel-dev/shared';
import TextInput from './SandboxTextInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TimeInputProps>();
const emit = defineEmits<TimeInputEmits>();

const model = useVModel(props, undefined, emit);
</script>
