<template>
  <div class="border col-span-2 gap-4 grid p-4 rounded-lg">
    <div class="flex">
      <component :is="`h${level}`">
        {{ translate(field.label) }}
      </component>

      <label class="align-middle flex ml-auto my-auto">
        <span>per carrier</span>

        <ToggleInput
          :id="`per_carrier_${field.label}`"
          v-model="perCarrier"
          title="Per carrier" />
      </label>
    </div>

    <p
      v-if="field.description"
      class="mb-4 text-gray-600 text-sm"
      v-text="translate(field.description)" />

    <div class="grid grid-cols-2">
      <component
        :is="subField.Component"
        v-for="subField in resolvedFields"
        :key="subField.name" />

      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, markRaw, ref} from 'vue';
import {get} from '@vueuse/core';
import {useLanguage} from '@myparcel-do/shared';
import {createField, useForm} from '@myparcel/vue-form-builder';
import {CarrierName} from '@myparcel/constants';
import {type SettingsGroup} from '../types/form.types';
import ToggleInput from './base/ToggleInput.vue';

const props = defineProps<{
  field: SettingsGroup;
  level?: number | string;
}>();

const form = useForm();

const perCarrier = ref(false);

const additionalFields = ref([]);

const {translate} = useLanguage();

const resolvedFields = computed(() => {
  const fields = props.field.fields ?? [];

  if (!perCarrier.value) {
    additionalFields.value.forEach((field) => {
      const {name} = field.field;

      form.setValue(name, undefined);
    });

    return fields;
  }

  if (!additionalFields.value.length) {
    fields.forEach((item) => {
      Object.values(CarrierName).forEach((carrier) => {
        const nameParts = item.field.name.split('.');

        if (nameParts.length > 1) {
          nameParts.splice(nameParts.length - 1, 0, `carrierSettings.${carrier}`);
        }

        const newField = markRaw(
          createField({
            ...item.field,
            ref: ref(get(item.field.ref)),
            name: nameParts.join('.'),
            props: {
              ...item.field.props,
              carrier,
              parentField: item.field.name,
            },
          }),
        );

        additionalFields.value.push(newField);
      });
    });
  }

  fields.forEach((item) => {
    /**
     * Copy the value from the main field to the additional fields
     */
    additionalFields.value
      // Check if parent matches and field is rendered
      .filter((field) => field.field.props.parentField === item.field.name && field.Component.name)
      .forEach((field) => {
        form.setValue(field.field.name, get(item.field.ref));
      });

    /**
     * Remove the main value
     */
    item.field.ref = undefined;
  });

  return additionalFields.value;
});
</script>
