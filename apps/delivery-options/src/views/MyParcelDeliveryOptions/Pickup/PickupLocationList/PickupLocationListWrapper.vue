<template>
  <PickupLocationListLoader v-show="loading" />

  <PickupLocationList
    v-if="pickupLocations?.length"
    v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationListLoader from './PickupLocationListLoader.vue';
import PickupLocationList from './PickupLocationList.vue';

const pickupLocations = useResolvedPickupLocations();

const loading = computed(() => pickupLocations.loading.value || !pickupLocations.value.length);
</script>
