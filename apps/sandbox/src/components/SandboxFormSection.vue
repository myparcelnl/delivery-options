<template>
  <template
    v-for="(field, index) in section.fields"
    :key="field.name">
    <RecursiveFields
      :field="field"
      :level="Number(level) + 1"
      :prefix="prefix" />

    <hr v-if="index < section.fields.length - 1" />
  </template>
</template>

<script lang="ts" setup>
import {type SettingsSection} from '../types';
import RecursiveFields from './RecursiveFields.vue';

withDefaults(
  defineProps<{
    section: SettingsSection;

    /**
     * Current level.
     */
    level?: number | string;

    /**
     * Whether this is a nested section.
     */
    nested?: boolean;

    /**
     * Prefix to prepend to field names.
     */
    prefix?: string;
  }>(),
  {level: 1},
);
</script>
