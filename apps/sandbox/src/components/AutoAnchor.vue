<template>
  <a
    :id="anchor"
    class="mp-scroll-m-4 reset">
    <slot />
  </a>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {useAnchorLink} from '../composables/useAnchorLink';

const props = defineProps<{name: string}>();
const propRefs = toRefs(props);

const {register} = useAnchorLink();

const anchor = register(propRefs.name);
</script>
