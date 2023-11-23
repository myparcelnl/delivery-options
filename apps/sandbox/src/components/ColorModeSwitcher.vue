<template>
  <CButton @click="cycle">
    {{ store }}
  </CButton>
</template>

<script lang="ts" setup>
import {useColorMode} from '@vueuse/core';
import CButton from './CButton.vue';

const options = ['auto', 'dark', 'light'] as const;

const {store} = useColorMode({
  modes: {
    dark: 'mp-dark',
  },
});

const cycle = () => {
  const index = options.indexOf(store.value) + 1;

  store.value = options[index % options.length];
};
</script>
