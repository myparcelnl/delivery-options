<template>
  <Box class="mp-gap-2 mp-grid">
    <h2 v-text="translate('package_type')" />

    <SandboxSettingsSection :section="section" />
  </Box>
</template>

<script lang="ts" setup>
import {KEY_CONFIG, CarrierSetting} from '@myparcel-do/shared';
import {PackageTypeName} from '@myparcel/constants';
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
      label: `option_${CarrierSetting.PackageType}`,
      component: FormRadioGroupInput,
      wrapper: false,
      props: {
        placeholder: translate('choose_date'),
        options: [PackageTypeName.Package, PackageTypeName.Mailbox, PackageTypeName.DigitalStamp].map((value) => ({
          label: translate(`package_type_${value}`),
          value,
        })),
      },
    }),
  ],
});
</script>
