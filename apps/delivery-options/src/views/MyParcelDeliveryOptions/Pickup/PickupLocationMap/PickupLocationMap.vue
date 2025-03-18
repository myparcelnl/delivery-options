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
        'mp-w-1/2': md,
        'mp-w-full': !md,
      }">
      <Suspense>
        <template #default>
          <PickupLocationMapMarker
            v-for="location in locations"
            :key="location.locationCode"
            :active="locationCode === location.locationCode"
            :location-code="location.locationCode" />
        </template>
      </Suspense>
    </LeafletMap>

    <div
      :class="{
        'mp-border-l mp-w-1/2': md,
        'mp-border-t': !md,
      }"
      class="mp-flex-grow mp-p-5">
      <PickupLocationDetails
        v-if="form.values.pickupLocation"
        :location-code="form.values.pickupLocation"
        expanded />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted, watch} from 'vue';
import PickupLocationMapMarker from '../PickupLocationMapMarker/PickupLocationMapMarker.vue';
import {useAddressStore} from '../../../../stores';
import {useDeliveryOptionsForm} from '../../../../form';
import {
  useBreakpoints,
  useResolvedPickupLocations,
  useSelectedPickupLocation,
  useSelectedValues,
} from '../../../../composables';
import {LeafletMap} from '../../../../components';
import PickupLocationDetails from './PickupLocationDetails.vue';

const {locations, reset} = useResolvedPickupLocations();
const addressStore = useAddressStore();
const {locationCode} = useSelectedPickupLocation();
const {instance: form} = useDeliveryOptionsForm();
const {md} = useBreakpoints();
const selectedValues = useSelectedValues();

/**
 * When the address changes, reset the pickup locations array and selected pickup location.
 */
const removeAddressHook = () => {
  reset();

  selectedValues.pickupLocation.value = undefined;
};

watch(addressStore.state, removeAddressHook);

onUnmounted(removeAddressHook);
</script>
