<template>
  <component :is="`h${level}`">
    {{ translate(field.key) }}
  </component>

  <!--      <label -->
  <!--        v-if="hasCarrierToggle" -->
  <!--        class="mp-align-middle mp-flex mp-ml-auto mp-my-auto"> -->
  <!--        <span>per carrier</span> -->

  <!--        <ToggleInput -->
  <!--          :id="`per_carrier_${field.key}`" -->
  <!--          v-model="carrierToggle" -->
  <!--          title="Per carrier" /> -->
  <!--      </label> -->

  <p
    v-if="field.description"
    class="mp-mb-4 mp-text-gray-600 mp-text-sm"
    v-text="translate(field.description)" />

  <div class="mp-gap-2 mp-grid mp-grid-cols-2">
    <slot />

    <component
      :is="subField.Component"
      v-for="subField in resolvedFields"
      :key="subField.name" />
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useCurrentPlatform, useLanguage} from '@myparcel-do/shared';
import {useForm} from '@myparcel/vue-form-builder';
import {type SettingsField, type SettingsGroup, type SettingsSection} from '../types';
import {useSandboxStore} from '../stores';

const props = defineProps<{
  field: SettingsGroup | SettingsField | SettingsSection;
  level?: number | string;
}>();

const form = useForm();
const store = useSandboxStore();
const platform = useCurrentPlatform();

// const hasCarrierToggle = computed(() => props.field.hasCarrierToggle === undefined);

// const carrierToggle = computed({
//   get() {
//     return props.field.hasCarrierToggle || store.carrierToggle.includes(props.field.key);
//   },
//
//   set(value) {
//     store.$patch({
//       carrierToggle: value
//         ? [...store.carrierToggle, props.field.key]
//         : store.carrierToggle.filter((label) => label !== props.field.key),
//     });
//   },
// });

// const additionalFields = ref([]);

const {translate} = useLanguage();

const resolvedFields = computed(() => {
  const {fields} = props.field;
  return fields;

  // if (!carrierToggle.value) {
  //   additionalFields.value.forEach((field) => {
  //     const {name} = field.field;
  //
  //     form.setValue(name, undefined);
  //   });
  //
  //   return fields;
  // }
  //
  // if (!additionalFields.value.length) {
  //   fields.forEach((item) => {
  //     platform.config.value.carriers.forEach((carrier) => {
  //       const newField = markRaw(generateConfigItemField(item, carrier));
  //
  //       additionalFields.value.push(newField);
  //     });
  //   });
  // }
  //
  // fields.forEach((item) => {
  //   /**
  //    * Copy the value from the main field to the additional fields
  //    */
  //   additionalFields.value
  //     // Check if parent matches and field is rendered
  //     .filter((field) => field.field.props.parentField === item.field.name && field.Component.name)
  //     .forEach((field) => {
  //       form.setValue(field.field.name, get(item.field.ref));
  //     });
  //
  //   /**
  //    * Remove the main value
  //    */
  //   item.field.ref = undefined;
  // });
  //
  // return additionalFields.value;
});
</script>
