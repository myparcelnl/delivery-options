<template>
  <GroupInput
    :id="id"
    :options="options">
    <template #input="{option}">
      <input
        :id="`${id}-${option.value}`"
        v-model="model"
        type="radio"
        :name="id"
        :value="option.value"
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
import {type SelectOption} from '@myparcel-dev/do-shared';
import GroupInput from '../GroupInput/GroupInput.vue';

interface Props {
  id: string;
  options: SelectOption<string>[];
  disabled?: boolean;
  readonly?: boolean;
}

const props = defineProps<Props>();
const model = defineModel<string>();
</script>
