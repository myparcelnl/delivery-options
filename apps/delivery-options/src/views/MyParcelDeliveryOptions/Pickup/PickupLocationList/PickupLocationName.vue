<template>
  <p v-text="pickupLocation.locationName" />

  <p
    class="mp-opacity-60"
    v-text="`${pickupLocation.street} ${pickupLocation.number}`" />

  <InfoLabel
    v-if="PickupLocationType.Locker === pickupLocation.type"
    :label="translate(PARCEL_LOCKER)"
    class="mp-mt-1">
    <ParcelLockerIcon />
  </InfoLabel>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {PARCEL_LOCKER, PickupLocationType, type CarrierIdentifier} from '@myparcel-do/shared';
import {useLanguage, usePickupLocation} from '../../../../composables';
import {ParcelLockerIcon, InfoLabel} from '../../../../components';

const props = defineProps<{locationCode: string; carrierIdentifier: CarrierIdentifier}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const {pickupLocation} = usePickupLocation(propRefs.locationCode, propRefs.carrierIdentifier);
</script>
