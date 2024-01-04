<template>
  <OsmMap>
    <Suspense>
      <template #default>
        <PickupLocationMapMarker
          v-for="location in pickupLocations"
          :key="location.location.location_code"
          :location="location" />
      </template>
    </Suspense>
  </OsmMap>
</template>

<script lang="ts" setup>
import PickupLocationMapMarker from '../PickupLocationMapMarker/PickupLocationMapMarker.vue';
import {useResolvedPickupLocations} from '../../../../composables';
import OsmMap from '../../../../components/map/OsmMap/OsmMap.vue';

const pickupLocations = useResolvedPickupLocations();
</script>
