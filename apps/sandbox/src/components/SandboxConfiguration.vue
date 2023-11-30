<template>
  <Form.Component @reset="clearConfig">
    <SandboxPlatformBox />

    <SandboxAddressBox />

    <Box>
      <SandboxFormSection
        v-for="section in configSections"
        :key="section.label"
        :section="section" />
    </Box>

    <Suspense @resolve="startListening">
      <template #default>
        <SandboxCarrierFormSections />
      </template>

      <template #fallback>
        <SandboxLoadingIndicator />
      </template>
    </Suspense>

    <SandboxStringsBox />
  </Form.Component>
</template>

<script lang="ts" setup>
import {watch} from 'vue';
import {createForm} from '@myparcel/vue-form-builder';
import {useSandboxStore} from '../stores';
import {getConfigurationSections} from '../form';
import SandboxStringsBox from './SandboxStringsBox.vue';
import SandboxPlatformBox from './SandboxPlatformBox.vue';
import SandboxLoadingIndicator from './SandboxLoadingIndicator.vue';
import SandboxFormSection from './SandboxFormSection.vue';
import SandboxCarrierFormSections from './SandboxCarrierFormSections.vue';
import SandboxAddressBox from './SandboxAddressBox.vue';
import FieldWrapper from './FieldWrapper.vue';
import {Box} from './Box';

const sandboxStore = useSandboxStore();

const configSections = getConfigurationSections();

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = createForm('configuration', {
  field: {
    wrapper: FieldWrapper,
  },

  initialValues: {...sandboxStore.configuration},
});

const clearConfig = () => {
  sandboxStore.$patch({
    configuration: undefined,
  });
};

/**
 * Start listening to changes in the configuration when the carrier fields have loaded. This is so the configuration is
 * not saved to storage before all fields are loaded.
 */
const startListening = () => {
  watch(Form.instance.values, (newConfiguration) => {
    sandboxStore.updateConfiguration(newConfiguration);
  });
};
</script>
