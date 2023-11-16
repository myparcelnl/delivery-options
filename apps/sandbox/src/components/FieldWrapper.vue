<template>
  <label
    :for="id"
    class="align-middle gap-2 grid-flow-col inline-grid justify-start py-2">
    <CarrierLogo
      v-if="element.props.carrier"
      :carrier="element.props.carrier" />

    <span v-text="element.label" />
  </label>

  <div class="flex">
    <slot v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
export default {inheritAttrs: false};
</script>

<script lang="ts" setup>
import {generateFieldId, CarrierLogo} from '@myparcel-do/shared';
import {useElement} from '@myparcel/vue-form-builder';

const element = useElement();

const id = generateFieldId(element);
</script>
