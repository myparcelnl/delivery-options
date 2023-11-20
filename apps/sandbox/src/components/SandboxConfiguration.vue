<template>
  <Form.Component @reset="clearConfig">
    <FormSection
      v-for="section in sections"
      :key="section.label"
      :section="section"
      level="2" />

    <CButton
      type="reset"
      @click="() => Form.instance.reset()">
      Reset
    </CButton>
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, markRaw, watch} from 'vue';
import {crush} from 'radash';
import {createForm} from '@myparcel/vue-form-builder';
import {type SettingsSection} from '../types';
import {useSandboxStore} from '../stores';
import {getSandboxSettingsSections} from '../form/getSandboxSettingsSections';
import FormSection from './FormSection.vue';
import FieldWrapper from './FieldWrapper.vue';
import CButton from './CButton.vue';

const sandboxStore = useSandboxStore();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createForm('configuration', {
  field: {
    wrapper: markRaw(FieldWrapper),
  },

  initialValues: {...crush(sandboxStore.configuration)},
});

const sections: SettingsSection[] = getSandboxSettingsSections();

const values = computed(() => Form.instance.getValues());

watch(values, (newConfiguration) => {
  sandboxStore.updateConfiguration(newConfiguration);
});

const clearConfig = () => {
  sandboxStore.$patch({
    configuration: undefined,
  });
};
</script>
