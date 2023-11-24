<template>
  <Loader.Wrapper>
    <Loader.Circle class="mp-h-10 mp-w-10" />

    <Loader.Container>
      <Loader.Text class="mp-w-1/3" />
      <Loader.Text class="mp-w-1/4" />
      <Loader.Text class="mp-w-1/3" />
      <Loader.Text class="mp-w-1/5" />
      <Loader.Text class="mp-w-1/6" />
      <Loader.Text class="mp-w-1/3" />
    </Loader.Container>
  </Loader.Wrapper>
</template>

<script lang="ts" setup>
import {Loader} from './loader/SandboxTextLoader';
</script>
