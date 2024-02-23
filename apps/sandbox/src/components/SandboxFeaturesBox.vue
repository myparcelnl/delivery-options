<template>
  <Box>
    <SandboxSettingsEntry :field="section" />
  </Box>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {
  CarrierSetting,
  ConfigSetting,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  KEY_CONFIG,
  type SelectOption,
} from '@myparcel-do/shared';
import {formField, formSection} from '../form';
import FormDropOffSelector from './form/input/FormDropOffSelector.vue';
import {FormNumberInput, FormRadioGroupInput, SandboxSettingsEntry} from './form';
import {Box} from './Box';

const section = formSection({
  key: 'general',
  fields: [
    formField({
      key: KEY_CONFIG,
      name: CarrierSetting.DropOffDays,
      ref: ref([]),
      component: FormDropOffSelector,
    }),

    formField({
      key: KEY_CONFIG,
      name: CarrierSetting.DropOffDelay,
      component: FormNumberInput,
      props: {
        min: DROP_OFF_DELAY_MIN,
        max: DROP_OFF_DELAY_MAX,
      },
    }),

    formField({
      key: KEY_CONFIG,
      name: CarrierSetting.DeliveryDaysWindow,
      component: FormNumberInput,
      props: {
        min: DELIVERY_DAYS_WINDOW_MIN,
        max: DELIVERY_DAYS_WINDOW_MAX,
      },
    }),

    formField({
      key: KEY_CONFIG,
      name: ConfigSetting.PickupLocationsDefaultView,
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
