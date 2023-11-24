<template>
  <Box>
    <component
      :is="field.Component"
      v-for="field in fields" />
  </Box>
</template>

<script lang="ts" setup>
import {Box} from './Box';

const fields = [];
</script>
