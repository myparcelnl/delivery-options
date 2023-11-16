<template>
  <input
    :id="id"
    v-model="model"
    :value="element.props.value"
    type="radio" />
</template>

<script lang="ts" setup>
import {type ElementEmits, type ElementProps, useElementContext} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<boolean>>();
const emit = defineEmits<ElementEmits<boolean>>();

const {id, model} = useElementContext(props, emit);
</script>
