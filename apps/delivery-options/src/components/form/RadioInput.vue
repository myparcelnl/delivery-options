<template>
  <input
    v-model="model"
    :value="element.props.value"
    type="radio" />
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {useVModel} from '@vueuse/core';
import {type ElementEmits, type ElementProps} from '@myparcel-do/shared';

const props = defineProps<ElementProps<boolean>>();
const emit = defineEmits<ElementEmits<boolean>>();

const propRefs = toRefs(props);
const model = useVModel(propRefs.modelValue, undefined, emit);
</script>
