<template>
  <SandboxNumberInput
    v-model.lazy.number="model"
    :class="classes"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import SandboxNumberInput from '../../base/SandboxNumberInput.vue';
import {useElInputClasses} from '../../../composables';

const model = defineModel<number>();

const classes = useElInputClasses();
</script>
