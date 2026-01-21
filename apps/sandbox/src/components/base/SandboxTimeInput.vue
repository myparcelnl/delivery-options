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
import {type TimeInputProps} from '@myparcel-dev/do-shared';
import TextInput from './SandboxTextInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TimeInputProps>();

const model = defineModel<string>();
</script>
