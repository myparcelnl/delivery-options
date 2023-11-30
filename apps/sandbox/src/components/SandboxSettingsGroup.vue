<template>
  <AutoAnchor :name="field.key">
    <component :is="`h${level}`">
      {{ translate(field.key) }}
    </component>
  </AutoAnchor>

  <p
    v-if="field.description"
    class="mp-mb-4 mp-text-gray-600 mp-text-sm"
    v-text="translate(field.description)" />

  <div class="mp-gap-2 mp-grid mp-grid-cols-2">
    <slot />

    <component
      :is="subField.Component"
      v-for="subField in resolvedFields"
      :key="subField.name" />
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useCurrentPlatform, useLanguage} from '@myparcel-do/shared';
import {useForm} from '@myparcel/vue-form-builder';
import {type SettingsField, type SettingsGroup, type SettingsSection} from '../types';
import {useSandboxStore} from '../stores';
import AutoAnchor from './AutoAnchor.vue';

const props = defineProps<{
  field: SettingsGroup | SettingsField | SettingsSection;
  level?: number | string;
}>();

const form = useForm();
const store = useSandboxStore();
const platform = useCurrentPlatform();

const {translate} = useLanguage();

const resolvedFields = computed(() => props?.field?.fields ?? []);
</script>
