<template>
  <p v-text="pickupLocation?.location.locationName" />

  <p
    class="mp-opacity-60"
    v-text="`${pickupLocation?.location.street} ${pickupLocation?.location.number}`" />

  <InfoLabel
    v-if="PickupLocationType.Locker === pickupLocation?.location.type"
    :label="translate(PARCEL_LOCKER)"
    class="mp-mt-1">
    <ParcelLockerIcon />
  </InfoLabel>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {PARCEL_LOCKER, PickupLocationType} from '@myparcel-do/shared';
import {useLanguage, usePickupLocation} from '../../../../composables';
import ParcelLockerIcon from '../../../../components/icons/ParcelLockerIcon.vue';
import InfoLabel from '../../../../components/common/InfoLabel/InfoLabel.vue';

const props = defineProps<{locationCode: string}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const pickupLocation = usePickupLocation(propRefs.locationCode);
</script>
