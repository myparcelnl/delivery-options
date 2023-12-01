<template>
  <KeepAlive>
    <component
      :is="Form?.Component"
      v-if="Form?.Component">
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
    </component>
  </KeepAlive>
</template>

<script lang="ts" setup>
import {computed, markRaw, reactive, toRef, watch} from 'vue';
import {crush} from 'radash';
import {type SupportedPlatformName} from '@myparcel-do/shared';
import {type CreatedForm, createForm} from '@myparcel/vue-form-builder';
import {useSandboxStore} from '../stores';
import {getConfigurationSections} from '../form';
import {useCurrentPlatform} from '../composables';
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

const platform = useCurrentPlatform();

// eslint-disable-next-line @typescript-eslint/naming-convention

const renderForPlatform = (platform: SupportedPlatformName): CreatedForm => {
  console.log('renderForPlatform', platform);

  return markRaw(
    createForm(`configuration.${platform}`, {
      field: {
        wrapper: FieldWrapper,
      },

      initialValues: {...crush(sandboxStore.resolvedConfiguration)},
    }),
  );
};

const nameRef = toRef(platform, 'name');

const forms = reactive({});

watch(
  nameRef,
  (newVal) => {
    if (forms[newVal]) {
      return;
    }

    forms[newVal] = renderForPlatform(newVal);
  },
  {immediate: true},
);

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = computed<CreatedForm>(() => forms[nameRef.value]);

/**
 * Start listening to changes in the configuration when the carrier fields have loaded. This is so the configuration is
 * not saved to storage before all fields are loaded.
 */
const startListening = () => {
  watch(Form.value.instance.values, (newConfiguration) => {
    sandboxStore.updateConfiguration(newConfiguration);
  });
};
</script>
