<template>
  <div>
    <img
      v-if="query.data"
      v-show="loaded && !hasError"
      :alt="carrier"
      :src="useAssetUrl(query.data.meta.logo_svg)"
      width="30"
      @error="hasError = true"
      @load="loaded = true" />

    <div
      v-show="!loaded || hasError || !query.data"
      class="" />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {type CarrierIdentifier} from '../types';
import {useCarrier} from '../sdk';
import {useAssetUrl} from '../composables/useAssetUrl';

const props = defineProps<{carrier: CarrierIdentifier}>();

const query = useCarrier(props.carrier);

const loaded = ref(false);

const hasError = ref(false);
</script>
