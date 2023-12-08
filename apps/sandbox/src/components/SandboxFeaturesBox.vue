<template>
  <Box>
    <h2>Features</h2>

    <SandboxSettingsSection :section="section" />
  </Box>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {
  DELIVERY_DAYS_WINDOW,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  KEY_CONFIG,
  type SelectOption,
} from '@myparcel-do/shared';
import {formField, formSection} from '../form';
import FormDropOffSelector from './form/input/FormDropOffSelector.vue';
import {FormNumberInput, FormRadioGroupInput, SandboxSettingsSection} from './form';
import {Box} from './Box';

const section = formSection({
  label: 'general',
  fields: [
    formField({
      key: KEY_CONFIG,
      name: DROP_OFF_DAYS,
      ref: ref([]),
      component: FormDropOffSelector,
    }),

    formField({
      key: KEY_CONFIG,
      name: DROP_OFF_DELAY,
      component: FormNumberInput,
      props: {
        min: DROP_OFF_DELAY_MIN,
        max: DROP_OFF_DELAY_MAX,
      },
    }),

    formField({
      key: KEY_CONFIG,
      name: DELIVERY_DAYS_WINDOW,
      component: FormNumberInput,
      props: {
        min: DELIVERY_DAYS_WINDOW_MIN,
        max: DELIVERY_DAYS_WINDOW_MAX,
      },
    }),

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
