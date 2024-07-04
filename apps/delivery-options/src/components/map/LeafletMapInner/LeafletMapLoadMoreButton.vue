<template>
  <div class="mp-absolute mp-bottom-10 mp-text-center mp-w-full mp-z-[99999]">
    <DoButton
      v-show="showLoadMoreButton"
      :class="{
        'mp-cursor-not-allowed mp-bg-gray-100 mp-opacity-50': loading,
      }"
      class="mp-inline-flex mp-px-2 mp-py-0.5 mp-transition-colors"
      no-spacing
      @click="loadMore">
      {{ translate(SHOW_MORE_LOCATIONS) }}
    </DoButton>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {SHOW_MORE_LOCATIONS} from '@myparcel-do/shared';
import {DoButton} from '../../common';
import {useLanguage, usePickupLocationsMap, useResolvedPickupLocations} from '../../../composables';

const {translate} = useLanguage();
const {locations, loadMoreLocations} = useResolvedPickupLocations();
const {showLoadMoreButton, map} = usePickupLocationsMap();

const loading = computed(() => locations.loading.value);

const loadMore = async () => {
  const center = map.value?.getCenter();

  if (!center) {
    return;
  }

  await loadMoreLocations(center.lat, center.lng);

  showLoadMoreButton.value = false;
};
</script>
