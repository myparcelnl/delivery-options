<template>
  <p v-text="location?.location?.locationName" />

  <p
    class="mp-opacity-60"
    v-text="`${location?.location?.street} ${location?.location?.number}`" />

  <InfoLabel
    v-if="PickupLocationType.Locker === location?.location?.type"
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

const props = defineProps<{pickupLocation: string}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const location = usePickupLocation(propRefs.pickupLocation);
</script>
