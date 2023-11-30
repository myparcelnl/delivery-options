<template>
  <div class="mp-flex-grow-0 mp-group mp-inline-flex mp-relative">
    <CButton class="group-hover:mp-rounded-b-none">
      <span>{{ language.emoji }}&nbsp;{{ language.name }}</span>
    </CButton>

    <div class="group-hover:mp-flex mp-absolute mp-flex-col mp-hidden">
      <CButton
        v-for="item in options"
        class="mp-rounded-none"
        @click="() => setLanguage(item.value)">
        {{ item.label }}
      </CButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type SelectOption} from '@myparcel-do/shared';
import {useLanguage} from '../composables';
import CButton from './CButton.vue';

const {availableLanguages, language, setLanguage} = useLanguage();

const options = computed<SelectOption[]>(() => {
  return availableLanguages
    .filter((item) => item.name !== language.value.name)
    .map((language) => {
      return {
        label: `${language.emoji} ${language.name}`,
        value: language.code,
      };
    });
});
</script>
