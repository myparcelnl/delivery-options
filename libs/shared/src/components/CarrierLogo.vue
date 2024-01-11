<template>
  <div class="after:mp-block after:mp-content-[''] after:mp-pb-[100%] mp-h-8 mp-inline-flex mp-select-none mp-w-8">
    <img
      v-if="!request.loading"
      v-show="loaded && !hasError"
      :alt="data?.human"
      :src="src"
      :title="data?.human"
      class="mp-m-auto"
      @error="hasError = true"
      @load="loaded = true" />
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {get} from '@vueuse/core';
import {type CarrierName} from '@myparcel/constants';
import {createAssetUrl} from '../utils';
import {useCarrierRequest} from '../sdk';

const props = defineProps<{carrier: CarrierName}>();

const loaded = ref(false);
const hasError = ref(false);

const request = computed(() => useCarrierRequest(props.carrier));
const data = computed(() => get(get(request).data));

const src = computed(() => createAssetUrl(data.value?.meta.logo_svg));
</script>
