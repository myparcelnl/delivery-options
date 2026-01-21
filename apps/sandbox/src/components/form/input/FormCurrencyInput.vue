<template>
  <SandboxCurrencyInput
    v-model="model"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import SandboxCurrencyInput from '../../base/SandboxCurrencyInput.vue';

const model = defineModel<number>();
</script>
