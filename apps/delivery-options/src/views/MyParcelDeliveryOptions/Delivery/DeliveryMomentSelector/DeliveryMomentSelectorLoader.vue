<template>
  <div class="mp-block mp-left-0 mp-top-0 mp-w-full">
    <Box>
      <Loader.Wrapper class="mp-flex mp-gap-2 mp-items-center mp-pb-2">
        <CarrierLogoLoader />

        <Loader.Text class="mp-w-16" />
      </Loader.Wrapper>

      <GroupInputLoader
        :rows="2"
        price>
        <RadioButtonLoader />
      </GroupInputLoader>
    </Box>
  </div>
</template>

<script lang="ts" setup>
import {Box, Loader} from '@myparcel-do/shared';
import {GroupInputLoader, CarrierLogoLoader, RadioButtonLoader} from '../../../../components';
</script>
