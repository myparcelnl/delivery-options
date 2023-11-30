<template>
  <SelectInput
    v-show="showSelect"
    v-model="model"
    :element="element"
    v-bind="$attrs" />

  <b v-show="!showSelect">
    <Loader.Wrapper v-show="options.length === 0">
      <Loader.Text class="mp-w-24" />
    </Loader.Wrapper>

    <span
      v-show="options.length > 0"
      v-text="options[0].label" />
  </b>
</template>

<script lang="ts">
export default {inheritAttrs: false};
</script>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {computed} from 'vue';
import {type SelectInputEmits, type SelectInputModelValue, type SelectInputProps, type WithElement} from '../types';
import {useSelectInputContext} from '../composables';
import SelectInput from './SelectInput.vue';
import {Loader} from './Loader';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>> & {options?: any; loading?: boolean}>();
const emit = defineEmits<SelectInputEmits<T>>();

const {model, options} = useSelectInputContext(props, emit);

const showSelect = computed(() => options.value.length > 1);
</script>
