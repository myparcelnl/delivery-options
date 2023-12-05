<template>
  <Box>
    <AutoAnchor name="strings">
      <h2>Strings</h2>
    </AutoAnchor>

    <SandboxSettingsSection :section="section" />
  </Box>
</template>

<script lang="ts" setup>
import {ALL_STRINGS, KEY_STRINGS} from '@myparcel-do/shared';
import {formField, formSection} from '../form';
import {FormTextInput, SandboxSettingsSection} from './form';
import {Box} from './Box';
import AutoAnchor from './AutoAnchor.vue';

const section = formSection({
  label: KEY_STRINGS,
  fields: ALL_STRINGS.map((key) =>
    formField({
      key: KEY_STRINGS,
      name: key,
      component: FormTextInput,
    }),
  ),
});
</script>
