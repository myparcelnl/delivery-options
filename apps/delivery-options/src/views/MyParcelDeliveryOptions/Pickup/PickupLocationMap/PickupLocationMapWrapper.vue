<template>
  <PickupLocationMapLoader v-show="loading" />

  <KeepAlive>
    <PickupLocationMap
      v-if="pickupLocations.length"
      v-show="!loading" />
  </KeepAlive>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationMapLoader from './PickupLocationMapLoader.vue';
import PickupLocationMap from './PickupLocationMap.vue';

const pickupLocations = useResolvedPickupLocations();

const loading = computed(() => !pickupLocations.value.length || pickupLocations.loading.value);
</script>
