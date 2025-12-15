<template>
  <CarrierBoxLoader>
    <GroupInputLoader
      :rows="4"
      price>
      <template #input />

      <div class="mp-gap-4 mp-grid mp-grid-flow-col mp-mb-1">
        <RadioButtonLoader class="mp-self-center" />

        <div class="mp-gap-2 mp-grid">
          <Loader.Text class="mp-w-32" />
          <Loader.Text class="mp-w-28" />
        </div>
      </div>
    </GroupInputLoader>
  </CarrierBoxLoader>
</template>

<script lang="ts" setup>
import {Loader} from '@myparcel-dev/shared';
import {CarrierBoxLoader, RadioButtonLoader, GroupInputLoader} from '../../../../components';
</script>
