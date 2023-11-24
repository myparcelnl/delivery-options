<template>
  <div class="after:mp-block after:mp-content-[''] after:mp-pb-[100%] mp-inline-flex mp-select-none mp-w-8">
    <img
      v-if="query.data"
      v-show="loaded && !hasError"
      :alt="carrier"
      :src="useAssetUrl(query.data.meta.logo_svg)"
      class="mp-m-auto"
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
import {useCarrierRequest} from '../sdk';
import {useAssetUrl} from '../composables';

const props = defineProps<{carrier: CarrierIdentifier}>();

const query = useCarrierRequest(props.carrier);

const loaded = ref(false);

const hasError = ref(false);
</script>
