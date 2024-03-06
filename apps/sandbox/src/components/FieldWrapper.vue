<template>
  <div
    v-show="element.isVisible"
    class="mp-gap-4 mp-grid mp-grid-cols-2 mp-items-start mp-mb-4">
    <div class="mp-flex mp-flex-col mp-gap-2">
      <label
        :for="id"
        class="mp-items-center mp-whitespace-nowrap">
        <slot name="label">
          {{ translate(element.label) }}
        </slot>
      </label>

      <SubText v-if="has(element.props.description)">
        <span v-html="translate(element.props.description)" />
      </SubText>
    </div>

    <div class="mp-flex mp-items-center mp-justify-start">
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
import {useLanguage} from '../composables';
import SubText from './SubText.vue';

const element = useElement();

const id = generateFieldId(element);

const {translate, has} = useLanguage();
</script>
