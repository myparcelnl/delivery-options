<template>
  <GroupInput :options="options" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {createPackageTypeTranslatable} from '../../../utils';
import {useConfigStore} from '../../../stores';
import {GroupInput} from '../../../components';

const config = useConfigStore();

const options = computed(() => [
  {
    value: config.packageType,
    label: createPackageTypeTranslatable(config.packageType),
  },
]);
</script>
