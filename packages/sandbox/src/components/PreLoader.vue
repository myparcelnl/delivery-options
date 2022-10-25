<template>
  <div class="bg-primary d-flex h-100 preloader w-100">
    <b-spinner
      class="m-auto preloader__spinner"
      variant="white" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'; export default defineComponent({
  name: 'PreLoader',
});
</script>
