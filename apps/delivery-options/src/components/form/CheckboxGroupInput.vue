<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`">
      <input
        :id="`${id}-${option.value}`"
        v-model="model"
        :disabled="elementProps.disabled || option.disabled"
        :name="id"
        :readonly="elementProps.readonly"
        :value="option.value"
        type="checkbox" />

      <span>
        {{ option.label }}
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type ElementEmits, type ElementProps, useElementContext} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<string>>();
const emit = defineEmits<ElementEmits<string>>();

const {id, model, elementProps} = useElementContext(props, emit);

const options = computed(() => props.element.props.options);
</script>
