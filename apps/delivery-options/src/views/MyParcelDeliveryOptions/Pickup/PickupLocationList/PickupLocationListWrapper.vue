<template>
  <PickupLocationList v-if="pickupLocations?.length" />

  <div v-else>Loading...</div>
</template>

<script lang="ts" setup>
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationList from './PickupLocationList.vue';

const pickupLocations = useResolvedPickupLocations();
</script>
