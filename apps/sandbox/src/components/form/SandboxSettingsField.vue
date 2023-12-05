<template>
  <component :is="field.Component" />
</template>

<script lang="ts" setup>
import {type SettingsField} from '../../types';

defineProps<{field: SettingsField}>();
</script>
