<template>
  <div class="mp-gap-4 mp-grid mp-grid-cols-2 mp-items-start mp-mb-4">
    <div class="mp-flex mp-flex-col mp-gap-2">
      <label
        :for="id"
        class="mp-items-center mp-whitespace-nowrap">
        <slot name="label">
          {{  translate(`option_${field.key}`)  }}
        </slot>
      </label>

      <SubText v-if="has(`option_${field.key}_description`)">
        <span v-html="translate(`option_${field.key}_description`)" />
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
import {useLanguage} from '../composables';
import {type SandboxConfigOption} from '../form/getAllSandboxConfigOptions';
import SubText from './SubText.vue';

const props = defineProps<{
  field: SandboxConfigOption;
}>();

const id = props.field.key;

const {translate, has} = useLanguage();
</script>
