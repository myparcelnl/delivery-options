<template>
  <SandboxSettingsGroup
    v-if="isGroup"
    :field="field as SettingsGroup"
    :level="level" />

  <SandboxSettingsSection
    v-else-if="isSection"
    :level="level"
    :prefix="prefix"
    :section="field as SettingsSection" />

  <component
    :is="(field as SettingsField).Component"
    v-else />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {isOfType} from '@myparcel-dev/ts-utils';
import {type SettingsField, type SettingsGroup, type SettingsSection} from '../../types';
import SandboxSettingsSection from './SandboxSettingsSection.vue';
import SandboxSettingsGroup from './SandboxSettingsGroup.vue';

const props = withDefaults(
  defineProps<{
    field: SettingsGroup | SettingsField | SettingsSection;
    level?: number | string;
    prefix?: string;
  }>(),
  {
    level: 1,
    prefix: '',
  },
);

const isGroup = computed(() => isOfType<SettingsGroup>(props.field, 'key'));
const isSection = computed(() => isOfType<SettingsSection>(props.field, 'fields'));
</script>
