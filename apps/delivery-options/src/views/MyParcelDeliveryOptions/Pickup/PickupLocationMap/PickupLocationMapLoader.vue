<template>
  <Loader.Wrapper class="mp-overflow-hidden mp-rounded-2xl">
    <Loader.Base
      :class="[
        'mp-flex-grow',
        {
          'mp-h-[400px]': md,
          'mp-h-[300px]': !md,
        },
      ]" />
  </Loader.Wrapper>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-dev/do-shared';
import {useBreakpoints} from '../../../../composables';

const {md} = useBreakpoints();
</script>
