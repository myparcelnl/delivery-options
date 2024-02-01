<template>
  <CButton @click="cycle">
    {{ emoji }}
  </CButton>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useColorMode} from '../composables';
import CButton from './CButton.vue';

const MODE_AUTO = 'auto';
const MODE_DARK = 'dark';
const MODE_LIGHT = 'light';

const options = [MODE_AUTO, MODE_DARK, MODE_LIGHT] as const;

const {store} = useColorMode();

const cycle = () => {
  const index = options.indexOf(store.value) + 1;

  store.value = options[index % options.length];
};

const emoji = computed(() => {
  switch (store.value) {
    case MODE_AUTO:
      return '🌓';

    case MODE_DARK:
      return '🌙';

    case MODE_LIGHT:
      return '☀️';
  }

  return '';
});
</script>
