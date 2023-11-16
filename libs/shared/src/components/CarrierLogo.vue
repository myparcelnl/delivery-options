<template>
  <div>
    <img
      v-if="query.data"
      :alt="carrier"
      :src="useAssetUrl(query.data.meta.logo_svg)"
      width="30" />
  </div>
</template>

<script lang="ts" setup>
import {type CarrierName} from '@myparcel/constants';
import {useCarrier} from '../sdk';
import {useAssetUrl} from '../composables/useAssetUrl';

const props = defineProps<{carrier: CarrierName}>();

const query = useCarrier(props.carrier);
</script>
