<template>
  <div class="@sm:mp-flex-row mp-border mp-flex mp-flex-col mp-overflow-hidden mp-relative mp-rounded-2xl">
    <LeafletMap
      :class="{
        '@sm:mp-w-1/2': Boolean(form.values.pickupLocation),
      }"
      class="@sm:mp-h-[400px] mp-h-[300px]">
      <Suspense>
        <template #default>
          <PickupLocationMapMarker
            v-for="location in pickupLocations"
            :key="location.location.location_code"
            :active="locationCode === location.location.location_code"
            :location-code="location.location.location_code" />
        </template>
      </Suspense>
    </LeafletMap>

    <div
      v-if="form.values.pickupLocation"
      class="@sm:mp-border-l @sm:mp-border-t-none @sm:mp-w-1/2 mp-border-t mp-flex-grow mp-p-5">
      <PickupLocationDetails :location-code="form.values.pickupLocation" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PickupLocationMapMarker from '../PickupLocationMapMarker/PickupLocationMapMarker.vue';
import {useDeliveryOptionsForm} from '../../../../form';
import {useResolvedPickupLocations, useSelectedPickupLocation} from '../../../../composables';
import LeafletMap from '../../../../components/map/LeafletMap/LeafletMap.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const pickupLocations = useResolvedPickupLocations();
const {instance: form} = useDeliveryOptionsForm();

const {locationCode} = useSelectedPickupLocation();
</script>
