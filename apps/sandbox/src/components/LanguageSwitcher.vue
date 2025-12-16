<template>
  <SandboxDropdownButton
    :model-value="language"
    :options="options"
    :variant="StyleVariant.Light"
    @update:modelValue="setLanguage">
    <span>{{ language.emoji }}{{ NBSP }}{{ language.name }}</span>
  </SandboxDropdownButton>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {NBSP, type SelectOption} from '@myparcel-dev/do-shared';
import {StyleVariant} from '../constants';
import {useLanguage} from '../composables';
import SandboxDropdownButton from './SandboxDropdownButton.vue';

const {availableLanguages, language, setLanguage} = useLanguage();

const options = computed<SelectOption[]>(() => {
  return availableLanguages
    .filter((item) => item.name !== language.value.name)
    .map((language) => ({
      label: `${language.emoji} ${language.name}`,
      value: language.code,
    }));
});
</script>
