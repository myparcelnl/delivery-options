<template>
  <OsmMap :center="[52.3450602, 4.8402087]">
    <OsmMarker
      v-for="location in pickupLocations"
      :key="location.location.location_code"
      :center="[Number(location.location.latitude), Number(location.location.longitude)]"
      :options="{title: location.location.location_name}" />
  </OsmMap>
</template>

<script lang="ts" setup>
import {useResolvedPickupLocations} from '../../../../composables';
import OsmMarker from '../../../../components/map/OsmMarker/OsmMarker.vue';
import OsmMap from '../../../../components/map/OsmMap/OsmMap.vue';

const pickupLocations = useResolvedPickupLocations();
</script>
