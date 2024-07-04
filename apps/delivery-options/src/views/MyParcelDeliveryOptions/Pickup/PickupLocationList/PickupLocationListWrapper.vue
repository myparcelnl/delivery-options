<template>
  <PickupLocationListLoader v-show="loading" />

  <PickupLocationList
    v-if="locations?.length"
    v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationListLoader from './PickupLocationListLoader.vue';
import PickupLocationList from './PickupLocationList.vue';

const {locations} = useResolvedPickupLocations();

const loading = computed(() => locations.loading.value && !locations.value.length);
</script>
