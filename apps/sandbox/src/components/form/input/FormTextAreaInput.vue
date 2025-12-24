<template>
  <SandboxTextAreaInput
    v-model="model"
    :class="classes" />
</template>

<script lang="ts" setup>
import {SandboxTextAreaInput} from '../../base';
import {useElInputClasses} from '../../../composables';

const model = defineModel<string>();

const classes = useElInputClasses();
</script>
