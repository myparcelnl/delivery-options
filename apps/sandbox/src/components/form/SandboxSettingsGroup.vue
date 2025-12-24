<template>
  <component :is="`h${level + 1}`">
    {{ translate(field.key) }}
  </component>

  <SubText v-if="field.description && has(field.description)">
    {{ translate(field.description) }}
  </SubText>

  <SandboxFieldCollection
    v-if="field.fields"
    :fields="field.fields"
    :prefix="prefix" />
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
    prefix?: string;
  }>(),
  {
    level: 1,
    prefix: '',
  }
);

const {translate, has} = useLanguage();
</script>
