<template>
  <PickupLocationMapLoader v-show="loading" />

  <KeepAlive>
    <PickupLocationMap
      v-if="loadedOnce"
      v-show="!loading" />
  </KeepAlive>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationMapLoader from './PickupLocationMapLoader.vue';
import PickupLocationMap from './PickupLocationMap.vue';

const {locations} = useResolvedPickupLocations();

const loading = ref(true);
const loadedOnce = ref(false);

const unwatch = watch(locations.loading, (value) => {
  loading.value = value;

  if (!value) {
    unwatch();
    loadedOnce.value = true;
  }
});
</script>
