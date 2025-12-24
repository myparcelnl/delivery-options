<template>
  <div class="mp-gap-4 mp-grid mp-grid-cols-2 mp-items-start mp-mb-4">
    <div class="mp-flex mp-flex-col mp-gap-2">
      <label
        :for="id"
        class="mp-items-center mp-whitespace-nowrap">
        <slot name="label">
          {{ translate(field.key) }}
        </slot>
      </label>

      <SubText v-if="field.description && has(field.description)">
        <span v-html="translate(field.description)" />
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
import {generateFieldId} from '@myparcel-dev/do-shared';
import {useLanguage} from '../composables';
import {type SandboxConfigOption} from '../form/getAllSandboxConfigOptions';
import SubText from './SubText.vue';

const props = defineProps<{
  field: SandboxConfigOption;
}>();

const id = generateFieldId({key: props.field.key});

const {translate, has} = useLanguage();
</script>
