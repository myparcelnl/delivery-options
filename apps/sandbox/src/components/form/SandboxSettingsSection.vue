<template>
  <div>
    <template
      v-for="field in section.fields"
      :key="field.name">
      <SandboxSettingsEntry
        :field="field"
        :level="Number(level) + 1"
        :prefix="prefix" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import {type SettingsSection} from '../../types';
import SandboxSettingsEntry from './SandboxSettingsEntry.vue';

withDefaults(
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
</script>
