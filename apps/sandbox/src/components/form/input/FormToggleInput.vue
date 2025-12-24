<template>
  <SandboxToggleInput
    v-model="model"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import SandboxToggleInput from '../../base/SandboxToggleInput.vue';

const model = defineModel<boolean>();
</script>
