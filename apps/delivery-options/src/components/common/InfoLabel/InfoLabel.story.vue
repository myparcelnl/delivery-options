<template>
  <Story>
    <Variant title="Default">
      <InfoLabel :label="state.label" />
    </Variant>

    <Variant title="Green">
      <InfoLabel
        :label="state.label"
        variant="green" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import InfoLabel from './InfoLabel.vue';

const state = reactive({
  label: 'Hello world',
});
</script>
