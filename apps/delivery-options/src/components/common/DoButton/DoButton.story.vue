<template>
  <Story>
    <Variant title="Single">
      <DoButton>{{ state.text }}</DoButton>
    </Variant>

    <Variant title="Two buttons">
      <DoButton>{{ state.text }}</DoButton>
      <DoButton>{{ state.text }}</DoButton>
    </Variant>

    <Variant title="Three buttons">
      <DoButton>We</DoButton>
      <DoButton>Stick</DoButton>
      <DoButton>Together</DoButton>
    </Variant>
    <Variant title="In a flex container">
      <div class="mp-flex">
        <DoButton>We</DoButton>
        <DoButton>Stick</DoButton>
        <DoButton>Together</DoButton>
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import DoButton from './DoButton.vue';

const state = reactive({
  text: 'Hello world',
});
</script>
