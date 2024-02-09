<template>
  <CarrierBoxLoader>
    <GroupInputLoader
      :rows="2"
      price>
      <template #input>
        <RadioButtonLoader />
      </template>
    </GroupInputLoader>
  </CarrierBoxLoader>
</template>

<script lang="ts" setup>
import {RadioButtonLoader, GroupInputLoader, CarrierBoxLoader} from '../../../../components';
</script>
