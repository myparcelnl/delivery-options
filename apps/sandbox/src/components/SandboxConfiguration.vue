<template>
  <KeepAlive>
    <component
      :is="Form?.Component"
      v-if="Form?.Component">
      <SandboxPlatformBox />

      <SandboxAddressBox />

      <SandboxCarrierConfigBox />

      <SandboxFeaturesBox />

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
import {useCurrentPlatform, useLanguage} from '../composables';
import SandboxStringsBox from './SandboxStringsBox.vue';
import SandboxPlatformBox from './SandboxPlatformBox.vue';
import SandboxFeaturesBox from './SandboxFeaturesBox.vue';
import SandboxCarrierConfigBox from './SandboxCarrierConfigBox.vue';
import SandboxAddressBox from './SandboxAddressBox.vue';
import FieldWrapper from './FieldWrapper.vue';

const sandboxStore = useSandboxStore();
const platform = useCurrentPlatform();

const nameRef = toRef(platform, 'name');
const forms = reactive({});

const renderForPlatform = (platform: SupportedPlatformName): CreatedForm => {
  const {translate} = useLanguage();

  return markRaw(
    createForm(`configuration.${platform}`, {
      renderLabel: translate,

      field: {
        wrapper: FieldWrapper,
      },

      initialValues: {...crush(sandboxStore.resolvedConfiguration)},
    }),
  );
};

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
</script>
