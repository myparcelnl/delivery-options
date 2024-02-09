<template>
  <PickupLocationMapLoader v-show="loading" />

  <PickupLocationMap
    v-if="pickupLocations.length"
    v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationMapLoader from './PickupLocationMapLoader.vue';
import PickupLocationMap from './PickupLocationMap.vue';

const pickupLocations = useResolvedPickupLocations();

const loading = computed(() => !pickupLocations.value.length || pickupLocations.loading.value);
</script>
