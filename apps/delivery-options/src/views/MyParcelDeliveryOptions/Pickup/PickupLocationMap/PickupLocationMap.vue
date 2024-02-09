<template>
  <div
    :class="{
      'mp-flex-row': md,
      'mp-flex-col': !md,
    }"
    class="mp-border mp-flex mp-overflow-hidden mp-relative mp-rounded-2xl">
    <LeafletMap
      :class="{
        'mp-h-[400px]': md,
        'mp-h-[300px]': !md,
        'mp-w-1/2': md && form.values.pickupLocation,
        'mp-w-full': !md || !form.values.pickupLocation,
      }">
      <Suspense>
        <template #default>
          <PickupLocationMapMarker
            v-for="location in pickupLocations"
            :key="location.locationCode"
            :active="locationCode === location.locationCode"
            :location-code="location.locationCode" />
        </template>
      </Suspense>
    </LeafletMap>

    <div
      v-if="form.values.pickupLocation"
      :class="{
        'mp-border-l mp-w-1/2': md,
        'mp-border-t': !md,
      }"
      class="mp-flex-grow mp-p-5">
      <PickupLocationDetails
        :location-code="form.values.pickupLocation"
        expanded />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PickupLocationMapMarker from '../PickupLocationMapMarker/PickupLocationMapMarker.vue';
import {useDeliveryOptionsForm} from '../../../../form';
import {useBreakpoints, useResolvedPickupLocations, useSelectedPickupLocation} from '../../../../composables';
import {LeafletMap} from '../../../../components';
import PickupLocationDetails from './PickupLocationDetails.vue';

const pickupLocations = useResolvedPickupLocations();

const {instance: form} = useDeliveryOptionsForm();

const {locationCode} = useSelectedPickupLocation();

const {md} = useBreakpoints();
</script>
