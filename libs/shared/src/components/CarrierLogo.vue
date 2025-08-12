<template>
  <div
    :class="{
      'mp-h-8 mp-w-8': !small,
      'mp-h-6 mp-w-6': small,
    }"
    class="after:mp-block after:mp-content-[''] after:mp-pb-[100%] mp-inline-flex mp-select-none">
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
import {computed, onUnmounted, reactive, ref, toRefs, watch, toValue} from 'vue';
import {createAssetUrl, resolveCarrierName} from '../utils';
import {type CarrierIdentifier} from '../types';
import {useCarrierFromCache} from '../composables';

const props = defineProps<{carrier: CarrierIdentifier; small?: boolean}>();
const propRefs = toRefs(props);

const loaded = ref(false);
const hasError = ref(false);
const data = ref();
const src = ref<string>();

const request = computed(() => reactive(useCarrierFromCache(resolveCarrierName(propRefs.carrier.value))));

const unwatch = watch(
  request,
  (value) => {
    const resolvedValue = toValue(value.data);

    data.value = resolvedValue;
    src.value = createAssetUrl(resolvedValue?.meta.logo_svg);
  },
  {deep: true, immediate: true},
);

onUnmounted(unwatch);
</script>
