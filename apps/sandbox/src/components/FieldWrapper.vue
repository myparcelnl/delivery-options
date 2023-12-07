<template>
  <div class="mp-gap-4 mp-grid mp-grid-cols-2 mp-mb-4">
    <label
      v-show="element.isVisible"
      :for="id"
      class="mp-gap-2 mp-grid mp-grid-flow-col mp-items-center mp-justify-start mp-overflow-x-scroll mp-pt-2 mp-self-start mp-whitespace-nowrap">
      <slot name="label">
        {{ element.label }}
      </slot>
    </label>

    <div
      v-show="element.isVisible"
      class="mp-flex mp-items-center mp-justify-start">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {inheritAttrs: false};
</script>

<script lang="ts" setup>
import {generateFieldId} from '@myparcel-do/shared';
import {useElement} from '@myparcel/vue-form-builder';

const element = useElement();

const id = generateFieldId(element);
</script>
