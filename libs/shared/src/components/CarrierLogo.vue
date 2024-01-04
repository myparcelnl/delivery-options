<template>
  <div class="after:mp-block after:mp-content-[''] after:mp-pb-[100%] mp-h-8 mp-inline-flex mp-select-none mp-w-8">
    <img
      v-if="query.data"
      v-show="loaded && !hasError"
      :alt="carrier"
      :src="src"
      class="mp-m-auto"
      @error="hasError = true"
      @load="loaded = true" />

    <div
      v-show="!loaded || hasError || !query.data"
      class="" />
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {get} from '@vueuse/core';
import {createAssetUrl} from '../utils';
import {type CarrierIdentifier} from '../types';
import {useCarrierRequest} from '../sdk';

const props = defineProps<{carrier: CarrierIdentifier}>();

const query = useCarrierRequest(props.carrier);

const loaded = ref(false);

const hasError = ref(false);

const src = computed(() => createAssetUrl(get(query.data)?.meta.logo_svg));
</script>
