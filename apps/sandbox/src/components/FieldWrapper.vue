<template>
  <label
    v-show="element.isVisible"
    :for="id"
    class="mp-gap-2 mp-grid-flow-col mp-inline-grid mp-items-center mp-justify-start mp-overflow-x-scroll mp-whitespace-nowrap">
    <CarrierLogo
      v-if="element.props.carrier"
      :carrier="element.props.carrier" />

    <span v-text="element.label" />
  </label>

  <div
    v-show="element.isVisible"
    class="mp-flex mp-items-center mp-justify-start">
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
