<template>
  <div class="@sm:mp-flex-row mp-border mp-flex mp-flex-col mp-overflow-hidden mp-relative mp-rounded-2xl">
    <OsmMap
      :class="{
        '@sm:mp-w-1/2': Boolean(form.values.pickupLocation),
      }"
      class="@sm:mp-h-[400px] mp-h-[300px]">
      <Suspense>
        <template #default>
          <PickupLocationMapMarker
            v-for="location in pickupLocations"
            :key="location.location.location_code"
            :pickup-location="location" />
        </template>
      </Suspense>
    </OsmMap>

    <div
      v-if="form.values.pickupLocation"
      class="@sm:mp-border-l @sm:mp-border-t-none @sm:mp-w-1/2 mp-border-t mp-flex-grow mp-p-5">
      <PickupLocationDetails :pickup-location="form.values.pickupLocation" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PickupLocationMapMarker from '../PickupLocationMapMarker/PickupLocationMapMarker.vue';
import {useDeliveryOptionsForm} from '../../../../form';
import {useResolvedPickupLocations} from '../../../../composables';
import OsmMap from '../../../../components/map/OsmMap/OsmMap.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const pickupLocations = useResolvedPickupLocations();
const form = useDeliveryOptionsForm();
</script>
