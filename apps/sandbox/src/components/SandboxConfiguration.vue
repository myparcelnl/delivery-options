<template>
  <Form.Component>
    <FormSection
      v-for="section in sections"
      :key="section.title"
      :section="section"
      level="2" />
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, watch} from 'vue';
import {createForm} from '@myparcel/vue-form-builder';
import {dot} from '../utils/dot';
import {type SettingsSection} from '../types';
import {getSandboxSettingsSections} from '../form/getSandboxSettingsSections';
import {useSandboxConfig} from '../composables/useSandboxConfig';
import FormSection from './FormSection.vue';
import FieldWrapper from './FieldWrapper.vue';

const config = useSandboxConfig();

const initial = dot(config.value);

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createForm('configuration', {
  field: {
    wrapper: FieldWrapper,
  },

  initialValues: initial,
});

const sections: SettingsSection[] = getSandboxSettingsSections();

const values = computed(() => Form.instance.getValues());

watch(values, (newSettings) => {
  config.storage.value = JSON.stringify(newSettings);
});
</script>
