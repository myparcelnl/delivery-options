<template>
  <SandboxTimeInput
    v-model.lazy="model"
    :class="classes"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import SandboxTimeInput from '../../base/SandboxTimeInput.vue';
import {useElInputClasses} from '../../../composables';

const model = defineModel<string>();

const classes = useElInputClasses();
</script>
