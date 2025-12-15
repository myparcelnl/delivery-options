<template>
  <Box class="mp-gap-2 mp-grid">
    <h2 v-text="translate('package_type')" />

    <SandboxSettingsSection :section="section" />
  </Box>
</template>

<script lang="ts" setup>
import {KEY_CONFIG, CarrierSetting, SUPPORTED_PACKAGE_TYPES} from '@myparcel-dev/shared';
import {createOptionTranslatable, createPackageTypeTranslatable} from '../utils';
import {formField, formSection} from '../form';
import {useLanguage} from '../composables';
import {SandboxSettingsSection, FormRadioGroupInput} from './form';
import {Box} from './Box';

const {translate} = useLanguage();

const section = formSection({
  label: 'package_type',
  fields: [
    formField({
      key: KEY_CONFIG,
      name: CarrierSetting.PackageType,
      label: createOptionTranslatable(CarrierSetting.PackageType),
      component: FormRadioGroupInput,
      wrapper: false,
      props: {
        options: SUPPORTED_PACKAGE_TYPES.map((value) => ({label: createPackageTypeTranslatable(value), value})),
      },
    }),
  ],
});
</script>
