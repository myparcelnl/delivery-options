<template>
  <GroupInput :options="options" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useConfigStore} from '../../../stores';
import {useLanguage} from '../../../composables';
import {GroupInput} from '../../../components';

const config = useConfigStore();

const {translate} = useLanguage();

const options = computed(() => [
  {
    value: config.packageType,
    label: translate(`package_type_${config.packageType}`),
  },
]);
</script>
