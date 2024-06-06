<template>
  <Box class="dark:mp-bg-monstera-800 mp-bg-monstera-200 mp-border-0">
    <SandboxSettingsEntry :field="section" />
  </Box>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {ConfigSetting, KEY_CONFIG} from '@myparcel-do/shared';
import {formField, formSection} from '../form';
import {SandboxSettingsEntry, FormTextInput} from './form';
import {Box} from './Box';

/**
 * !!VERY SECRET OPTIONS!! DO NOT READ!!
 */
const section = formSection({
  key: 'super_secret',
  fields: [
    formField({
      key: KEY_CONFIG,
      name: ConfigSetting.ApiBaseUrl,
      component: FormTextInput,
      ref: ref('https://api.myparcel.nl'),
      afterUpdate() {
        window.location.reload();
      },
    }),
  ],
});
</script>
