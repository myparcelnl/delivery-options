<template>
  <GroupInput
    :id="id"
    :options="options">
    <template #input="{option}">
      <input
        :id="`${id}-${option.value}`"
        v-model="model"
        type="checkbox"
        :name="id"
        :value="option.value"
        :checked="option.selected"
        :disabled="option.disabled || disabled"
        :readonly="readonly" />
    </template>

    <template
      v-for="slot in Object.keys($slots)"
      #[slot]="context">
      <slot
        :name="slot"
        v-bind="context" />
    </template>
  </GroupInput>
</template>

<script lang="ts" setup>
import {watch} from 'vue';
import {type SelectOption} from '@myparcel-dev/do-shared';
import GroupInput from '../GroupInput/GroupInput.vue';

interface Props {
  id: string;
  options: SelectOption<string>[];
  disabled?: boolean;
  readonly?: boolean;
}

const props = defineProps<Props>();
const model = defineModel<string[]>();

// Emit a value update whenever the "selected" state of the checkboxes changes.
watch(
  // Watch the values of the selected options, e.g. "signature,only_recipient". A string compares by value, an
  // array by reference: a new array on every options update would run the callback again and loop.
  () =>
    props.options
      .filter((option) => option.selected)
      .map((option) => option.value)
      .join(),
  // Update the model value whenever the selected state changes
  () => {
    model.value = props.options.filter((option) => option.selected).map((option) => option.value);
  },
  {immediate: true},
);
</script>
