<template>
  <div>
    <template
      v-for="(field, index) in section.fields"
      :key="`${section.label}_${index}`">
      <!-- Handle nested sections -->
      <SandboxSettingsSection
        v-if="isSection(field)"
        :section="field"
        :level="Number(level) + 1"
        :prefix="prefix" />

      <!-- Handle groups -->
      <SandboxSettingsGroup
        v-else-if="isGroup(field)"
        :field="field"
        :level="Number(level) + 1"
        :prefix="prefix" />

      <!-- Handle individual fields -->
      <SandboxFieldCollection
        v-else
        :fields="[field]"
        :prefix="prefix" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import {isOfType} from '@myparcel-dev/ts-utils';
import {type SettingsSection, type SettingsGroup, type SettingsField} from '../../types';
import SandboxSettingsGroup from './SandboxSettingsGroup.vue';
import SandboxFieldCollection from './SandboxFieldCollection.vue';

const props = withDefaults(
  defineProps<{
    section: SettingsSection;

    /**
     * Current level.
     */
    level?: number | string;

    /**
     * Prefix to prepend to field names.
     */
    prefix?: string;
  }>(),
  {
    level: 1,
    prefix: '',
  },
);

// Type guards to determine field types
const isSection = (field: SettingsField | SettingsGroup | SettingsSection): field is SettingsSection => {
  return isOfType<SettingsSection>(field, 'fields') && Array.isArray(field.fields);
};

const isGroup = (field: SettingsField | SettingsGroup | SettingsSection): field is SettingsGroup => {
  return isOfType<SettingsGroup>(field, 'key') && typeof field.key === 'string';
};
</script>
