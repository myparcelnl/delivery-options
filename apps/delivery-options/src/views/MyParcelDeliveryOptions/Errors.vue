<template>
  <ul>
    <li
      v-for="error in (exceptions as ErrorResponse['errors'])"
      :key="error.message">
      <span v-text="translate(`error${error.code}`)" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {useApiExceptions} from '@myparcel-do/shared';
import {type ErrorResponse} from '@myparcel/sdk';
import {useLanguage} from '../../composables';

const {exceptions} = useApiExceptions();

const {translate} = useLanguage();
</script>
