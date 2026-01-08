<template>
  <SandboxTextInput
    v-model.lazy.trim="model"
    :class="classes"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import SandboxTextInput from '../../base/SandboxTextInput.vue';
import {useElInputClasses} from '../../../composables';

const model = defineModel<string>();

const classes = useElInputClasses();
</script>
