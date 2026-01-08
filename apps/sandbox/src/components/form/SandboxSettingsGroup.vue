<template>
  <component :is="`h${level + 1}`">
    {{ translate(field.key) }}
  </component>

  <SubText v-if="field.description && has(field.description)">
    {{ translate(field.description) }}
  </SubText>

  <SandboxFieldCollection
    v-if="field.fields"
    :fields="field.fields" />
</template>

<script lang="ts" setup>
import SubText from '../SubText.vue';
import {type SettingsGroup} from '../../types';
import {useLanguage} from '../../composables';
import SandboxFieldCollection from './SandboxFieldCollection.vue';

const props = withDefaults(
  defineProps<{
    field: SettingsGroup;
    level?: number | string;
  }>(),
  {
    level: 1
  }
);

const {translate, has} = useLanguage();
</script>
