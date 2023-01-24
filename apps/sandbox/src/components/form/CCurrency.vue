<template>
  <component :is="symbol ? 'b-input-group' : 'div'">
    <BInputGroupPrepend v-if="symbol">
      <BInputGroupText v-text="symbol" />
    </BInputGroupPrepend>

    <CNumber
      ref="input"
      v-model="mutableValue"
      :min="-20"
      :max="20"
      :step="0.01"
      lazy-formatter
      :formatter="formatter"
      v-bind="filteredProps" />
  </component>
</template>

<script>
import CNumber from '../../delivery-options/src/sandbox/components/form/CNumber';
import { formCurrencyInput } from '../../delivery-options/src/sandbox/services/mixins/formCurrencyInput';

export default {
  name: 'CCurrency',
  components: { CNumber },
  mixins: [
    formCurrencyInput,
  ],
};
</script>
