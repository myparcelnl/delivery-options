<template>
  <PickupLocationMap v-if="pickupLocations?.length" />

  <div v-else>Loading...</div>
</template>

<script lang="ts" setup>
import {useResolvedPickupLocations} from '../../../../composables';
import PickupLocationMap from './PickupLocationMap.vue';

const pickupLocations = useResolvedPickupLocations();
</script>
