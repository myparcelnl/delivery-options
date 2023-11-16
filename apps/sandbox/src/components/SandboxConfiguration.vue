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
import {computed, markRaw, watch} from 'vue';
import {construct} from 'radash';
import {type DeliveryOptionsConfiguration, useDeliveryOptionsConfig} from '@myparcel-do/shared';
import {createForm} from '@myparcel/vue-form-builder';
import {type SettingsSection} from '../types';
import {useSandboxStore} from '../stores';
import {getSandboxSettingsSections} from '../form/getSandboxSettingsSections';
import FormSection from './FormSection.vue';
import FieldWrapper from './FieldWrapper.vue';

const sandboxStore = useSandboxStore();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createForm('configuration', {
  field: {
    wrapper: markRaw(FieldWrapper),
  },

  initialValues: {...sandboxStore.configuration},
});

const sections: SettingsSection[] = getSandboxSettingsSections();

const values = computed(() => Form.instance.getValues());

watch(values, (newConfiguration) => {
  sandboxStore.$patch({
    configuration: newConfiguration,
  });

  useDeliveryOptionsConfig().update(construct(newConfiguration) as DeliveryOptionsConfiguration);
});
</script>
