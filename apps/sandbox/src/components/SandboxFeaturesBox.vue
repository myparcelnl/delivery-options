<template>
  <SandboxSettingsSection :section="section" />
</template>

<script lang="ts" setup>
import {FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW, KEY_CONFIG, type SelectOption} from '@myparcel-do/shared';
import {formField, formSection} from '../form';
import {FormRadioGroupInput, SandboxSettingsSection} from './form';

const section = formSection({
  label: 'general',
  fields: [
    formField({
      key: KEY_CONFIG,
      name: FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
      component: FormRadioGroupInput,
      props: {
        options: [
          {
            value: 'list',
            label: 'list',
          },
          {
            value: 'map',
            label: 'map',
          },
        ] satisfies SelectOption[],
      },
    }),
  ],
});
</script>
