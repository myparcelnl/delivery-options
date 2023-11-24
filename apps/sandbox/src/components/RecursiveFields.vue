<template>
  <SandboxSettingsGroup
    v-if="isGroup"
    :field="field as SettingsGroup"
    :level="level" />

  <SandboxFormSection
    v-else-if="isSection"
    :level="level"
    :section="field as SettingsSection"
    nested />

  <component
    :is="field.Component"
    v-else />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {isOfType} from '@myparcel/ts-utils';
import {type SettingsField, type SettingsGroup, type SettingsSection} from '../types';
import SandboxSettingsGroup from './SandboxSettingsGroup.vue';
import SandboxFormSection from './SandboxFormSection.vue';

const props = withDefaults(
  defineProps<{
    field: SettingsGroup | SettingsField | SettingsSection;
    level?: number | string;
    prefix?: string;
  }>(),
  {level: 1},
);

const isGroup = computed(() => isOfType<SettingsGroup>(props.field, 'key'));

const isSection = computed(() => isOfType<SettingsSection>(props.field, 'fields'));
</script>
