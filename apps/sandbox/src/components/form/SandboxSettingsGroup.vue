<template>
  <component :is="`h${level + 1}`">
    {{ translate(field.key) }}
  </component>

  <SubText v-if="field.description && has(field.description)">
    {{ translate(field.description) }}
  </SubText>

  <SandboxSettingsEntry
    v-for="(subField, index) in resolvedFields"
    :key="`${index}_${subField.field.name}`"
    :field="subField" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import SubText from '../SubText.vue';
import {type SettingsGroup} from '../../types';
import {useLanguage} from '../../composables';
import SandboxSettingsEntry from './SandboxSettingsEntry.vue';

const props = defineProps<{field: SettingsGroup; level?: number | string}>();

const {translate, has} = useLanguage();

const resolvedFields = computed(() => props?.field?.fields ?? []);
</script>
