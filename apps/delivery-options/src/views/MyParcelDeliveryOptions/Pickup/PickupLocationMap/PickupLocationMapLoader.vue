<template>
  <Loader.Wrapper>
    <Loader.Base
      :class="{
        'mp-h-[400px]': md,
        'mp-h-[300px]': !md,
      }" />
  </Loader.Wrapper>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-do/shared';
import {useBreakpoints} from '../../../../composables';

const {md} = useBreakpoints();
</script>
