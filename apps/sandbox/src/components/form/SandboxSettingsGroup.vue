<template>
  <AutoAnchor :name="field.key">
    <component :is="`h${level}`">
      {{ translate(field.key) }}
    </component>
  </AutoAnchor>

  <SubText v-if="field.description">
    {{ translate(field.description) }}
  </SubText>

  <SandboxSettingsEntry
    v-for="subField in resolvedFields"
    :key="subField.name"
    :field="subField" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import SubText from '../SubText.vue';
import AutoAnchor from '../AutoAnchor.vue';
import {type SettingsGroup} from '../../types';
import {useLanguage} from '../../composables';
import SandboxSettingsEntry from './SandboxSettingsEntry.vue';

const props = defineProps<{field: SettingsGroup; level?: number | string}>();

const {translate} = useLanguage();

const resolvedFields = computed(() => props?.field?.fields ?? []);
</script>
