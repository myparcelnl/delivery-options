<template>
  <component :is="symbol ? 'b-input-group' : 'div'">
    <BInputGroupPrepend v-if="symbol">
      <BInputGroupText v-text="symbol" />
    </BInputGroupPrepend>

    <CNumber
      ref="input"
      v-model="mutableValue"
      :formatter="formatter"
      :max="20"
      :min="-20"
      :step="0.01"
      lazy-formatter
      v-bind="filteredProps" />
  </component>
</template>

<script lang="ts">
import CNumber from './CNumber.vue';

export default {
  name: 'CCurrency',
  components: {CNumber},
  mixins: [formCurrencyInput],
};
</script>
