<template>
  <p v-text="location?.locationName" />

  <p
    class="mp-opacity-60"
    v-text="`${location?.street} ${location?.number}`" />

  <InfoLabel
    v-if="PickupLocationType.Locker === location?.type"
    :label="translate('parcelLocker')"
    class="mp-mt-1">
    <ParcelLockerIcon />
  </InfoLabel>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {PickupLocationType} from '@myparcel-do/shared';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import {useLanguage} from '../../../../composables';
import ParcelLockerIcon from '../../../../components/icons/ParcelLockerIcon.vue';
import InfoLabel from '../../../../components/common/InfoLabel/InfoLabel.vue';

const props = defineProps<{
  /**
   * JSON encoded ResolvedPickupLocation
   * @see ResolvedPickupLocation
   * */
  pickupLocation: string;
}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const {location} = usePickupLocation(propRefs.pickupLocation);
</script>
