<template>
  <div>
    <Form.Component />
  </div>
</template>

<script lang="ts" setup>
import {createForm} from '@myparcel/vue-form-builder';

const Form = createForm('DeliveryOptions', {});
</script>
