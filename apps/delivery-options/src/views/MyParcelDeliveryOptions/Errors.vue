<template>
  <ul>
    <li
      v-for="error in exceptions"
      :key="error.code"
      class="before:mp-absolute before:mp-bg-red-500 before:mp-h-full before:mp-inset-0 before:mp-w-1 mp-bg-opacity-5 mp-bg-red-500 mp-border mp-overflow-hidden mp-px-6 mp-py-4 mp-relative mp-rounded-lg">
      <span v-text="translate(error.label)" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {useApiExceptions} from '@myparcel-do/shared';
import {useLanguage} from '../../composables';

const {exceptions} = useApiExceptions();

const {translate} = useLanguage();
</script>
