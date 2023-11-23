<template>
  <div
    :class="{
      'mp-gap-4 mp-grid mp-grid-cols-2': !nested,
    }">
    <component
      :is="`h${level}`"
      class="mp-col-span-2">
      {{ translate(section.label) }}
    </component>

    <RecursiveFields
      v-for="field in section.fields"
      :key="field.name"
      :field="field"
      :level="Number(level) + 1" />
  </div>
</template>

<script lang="ts" setup>
import {useLanguage} from '@myparcel-do/shared';
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
  }>(),
  {level: 1},
);

const {translate} = useLanguage();
</script>
