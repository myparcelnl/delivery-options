<template>
  <Form.Component @reset="clearConfig">
    <SandboxAddressBox />

    <Box>
      <SandboxFormSection
        v-for="section in configSections"
        :key="section.label"
        :section="section" />
    </Box>

    <Suspense>
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
import {computed} from 'vue';
import {debouncedWatch} from '@vueuse/core';
import {createForm} from '@myparcel/vue-form-builder';
import {useSandboxStore} from '../stores';
import {getConfigurationSections} from '../form/getConfigurationSections';
import SandboxStringsBox from './SandboxStringsBox.vue';
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

const values = computed(() => Form.instance.getValues());

debouncedWatch(
  values,
  (newConfiguration) => {
    sandboxStore.updateConfiguration(newConfiguration);
  },
  {debounce: 200},
);

const clearConfig = () => {
  sandboxStore.$patch({
    configuration: undefined,
  });
};
</script>
