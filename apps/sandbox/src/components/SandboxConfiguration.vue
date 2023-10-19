<template>
  <Form.Component> </Form.Component>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {createForm} from '@myparcel/vue-form-builder';

const form = ref();

const Form = createForm('configuration', {});

console.log(Form);
</script>
