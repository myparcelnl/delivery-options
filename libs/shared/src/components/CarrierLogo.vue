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
import {computed, onUnmounted, reactive, ref, toRefs, watch} from 'vue';
import {get} from '@vueuse/core';
import {type CarrierName} from '@myparcel/constants';
import {createAssetUrl} from '../utils';
import {useCarrierRequest} from '../composables';

const props = defineProps<{carrier: CarrierName}>();
const propRefs = toRefs(props);

const loaded = ref(false);
const hasError = ref(false);
const data = ref();
const src = ref<string>();

const request = computed(() => reactive(useCarrierRequest(propRefs.carrier.value)));

const unwatch = watch(
  request,
  (request) => {
    data.value = get(request.data);
    src.value = createAssetUrl(get(data).meta.logo_svg);
  },
  {deep: true, immediate: true},
);

onUnmounted(unwatch);
</script>
