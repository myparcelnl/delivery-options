<template>
  <Box>
    <div
      v-if="data"
      class="mp-flex mp-gap-2 mp-items-center mp-pb-2">
      <CarrierLogo
        :carrier="data.name"
        small />

      <b v-text="data.human" />

      <slot name="heading" />
    </div>

    <slot />
  </Box>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {type CarrierIdentifier} from '@myparcel-do/shared';
import {resolveCarrierName} from '../utils';
import {useCarrierRequest} from '../composables';
import CarrierLogo from './CarrierLogo.vue';
import Box from './Box.vue';

const props = defineProps<{carrier: CarrierIdentifier}>();
const propRefs = toRefs(props);

const {data} = useCarrierRequest(resolveCarrierName(propRefs.carrier.value));
</script>
