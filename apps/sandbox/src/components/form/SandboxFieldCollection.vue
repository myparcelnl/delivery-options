<template>
  <FieldWrapper
    v-for="field in visibleFields"
    :key="field.key"
    v-show="isFieldVisible(field)"
    :field="field">
    <component
      :is="getComponent(field)"
      :model-value="getFieldModelValue(field.key)"
      @update:model-value="updateFieldValue(field.key, $event)"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldProps(field)" />
  </FieldWrapper>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {get, set} from 'radash';
import {useSandboxStore} from '../../stores';
import {getComponent} from '../../form/getComponent';
import {findSandboxOption} from '../../utils/findSandboxOption';
import {type SandboxConfigOption} from '../../form/getAllSandboxConfigOptions';
import FieldWrapper from '../FieldWrapper.vue';

interface Props {
  fields: SandboxConfigOption[];
  prefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: '',
});

const sandboxStore = useSandboxStore();

const visibleFields = computed(() => props.fields);

// Helper function to check if all parent fields are enabled
const allParentsHave = (parents: string[] | undefined, prefix: string): boolean => {
  if (!parents || parents.length === 0) return true;

  return parents.every((parent) => {
    const fieldName = prefix ? `${prefix}.${parent}` : parent;
    const parentOption = findSandboxOption(parent);
    const value = get(sandboxStore.resolvedConfiguration, fieldName, false);

    return Boolean(value) && parentOption && allParentsHave(parentOption.parents, prefix);
  });
};

// Check if field is visible based on parent dependencies
const isFieldVisible = (field: SandboxConfigOption): boolean => {
  return allParentsHave(field.parents, props.prefix);
};

// Check if field is disabled (same logic as visibility for now)
const isFieldDisabled = (field: SandboxConfigOption): boolean => {
  return !allParentsHave(field.parents, props.prefix);
};

// Get field value from store
const getFieldModelValue = (fieldKey: string) => {
  const fullKey = props.prefix ? `${props.prefix}.${fieldKey}` : fieldKey;
  return get(sandboxStore.resolvedConfiguration, fullKey);
};

// Update field value in store
const updateFieldValue = (fieldKey: string, value: unknown) => {
  const fullKey = props.prefix ? `${props.prefix}.${fieldKey}` : fieldKey;
  const newConfig = {...sandboxStore.resolvedConfiguration};
  set(newConfig, fullKey, value);
  sandboxStore.updateConfiguration(newConfig);
};

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
