<template>
  <FieldWrapper
    v-for="field in visibleFields"
    :key="field.key"
    v-show="isFieldVisible(field)"
    :field="field">

    <component
      :is="getComponent(field)"
      :model-value="fieldValues[field.key]?.value"
      @update:model-value="fieldValues[field.key].value = $event"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldProps(field)" />
  </FieldWrapper>
</template>

<script lang="ts" setup>
import {computed, type Ref, type WritableComputedRef} from 'vue';
import {get, set} from 'radash';
import {useSandboxStore} from '../../stores';
import {getComponent} from '../../form/getComponent';
import { allParentsHave } from '../../form';
import {type SandboxConfigOption} from '../../form/getAllSandboxConfigOptions';
import FieldWrapper from '../FieldWrapper.vue';

interface Props {
  fields: SandboxConfigOption[];
}

const props = defineProps<Props>();

const sandboxStore = useSandboxStore();

// Local tracking of field values, used to sync with the store. Cannot bind nested store paths directly given it's a reactive object not a ref.
const fieldValues: Record<string, WritableComputedRef<unknown>> = {};

const visibleFields = computed(() => props.fields);

// Strip the last part of the storePath to get the base path
const getFieldBasePath = (field: SandboxConfigOption): string => {
  if (field.storePath?.length) {
    const pathParts = field.storePath as string;
    return pathParts.substring(0, pathParts.lastIndexOf('.'));
  }
  return '';
};

// Check if field is visible based on parent dependencies
const isFieldVisible = (field: SandboxConfigOption): boolean => {
  return allParentsHave(field.parents, getFieldBasePath(field));
};

// Check if field is disabled (same logic as visibility for now)
const isFieldDisabled = (field: SandboxConfigOption): boolean => {
  return !allParentsHave(field.parents, getFieldBasePath(field));
};

// Map fieldValues to store values
props.fields.forEach((field) => {
  if (field.storePath?.length) {
    fieldValues[field.key] = computed({
      get: () => get(sandboxStore, field.storePath as string),
      set: (value) => {
        set(sandboxStore, field.storePath as string, value);
      },
    });
  }
});

// Get additional props for the field component
const getFieldProps = (field: SandboxConfigOption) => {
  const props: Record<string, unknown> = {};

  // Add field-specific props based on type
  if (field.options) {
    props.options = field.options;
  }

  if (field.placeholder) {
    props.placeholder = field.placeholder;
  }

  return props;
};
</script>
