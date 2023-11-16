<template>
  <FormSettingsGroup
    :is="field.component"
    v-if="isGroup"
    :field="field as SettingsGroup"
    :level="level" />

  <component
    :is="field.Component"
    v-else />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {isOfType} from '@myparcel/ts-utils';
import {type SettingsField, type SettingsGroup} from '../types/form.types';
import FormSettingsGroup from './FormSettingsGroup.vue';

const props = withDefaults(defineProps<{field: SettingsGroup | SettingsField; level?: number | string}>(), {level: 1});

const isGroup = computed(() => isOfType<SettingsGroup>(props.field, 'label'));
</script>
