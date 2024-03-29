<template>
  <DoButton
    class="mp-h-8 mp-inline-flex mp-w-8"
    no-spacing>
    <div class="mp-m-auto">
      <slot></slot>
    </div>
  </DoButton>
</template>

<script lang="ts" setup>
import DoButton from '../DoButton/DoButton.vue';
</script>
