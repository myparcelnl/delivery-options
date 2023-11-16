<template>
  <div class="gap-4 grid grid-cols-2">
    <component
      :is="`h${level}`"
      class="col-span-2">
      {{ translate(section.label) }}
    </component>

    <FieldOrGroup
      v-for="field in section.fields"
      :key="field.name"
      :field="field"
      :level="Number(level) + 1" />
  </div>
</template>

<script lang="ts" setup>
import {useLanguage} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import FieldOrGroup from './FieldOrGroup.vue';

withDefaults(defineProps<{section: SettingsSection; level?: number | string}>(), {level: 1});

const {translate} = useLanguage();
</script>
