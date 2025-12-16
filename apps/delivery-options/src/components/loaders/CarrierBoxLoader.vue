<template>
  <div class="mp-block mp-left-0 mp-top-0 mp-w-full">
    <Box>
      <Loader.Wrapper class="mp-flex mp-gap-2 mp-items-center mp-pb-2">
        <CarrierLogoLoader />

        <Loader.Text class="mp-w-16" />
      </Loader.Wrapper>

      <slot />
    </Box>
  </div>
</template>

<script lang="ts" setup>
import {Box, Loader} from '@myparcel-dev/do-shared';
import {CarrierLogoLoader} from '../index';
</script>
