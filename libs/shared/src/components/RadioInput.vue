<template>
  <input
    v-model="model"
    type="radio" />
</template>

<script lang="ts" setup>
const model = defineModel('model');
</script>
