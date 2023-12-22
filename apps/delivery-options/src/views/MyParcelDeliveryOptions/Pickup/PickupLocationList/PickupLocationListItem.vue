<template>
  <div>
    <p v-text="location?.location.location_name" />

    <p
      class="mp-opacity-60"
      v-text="address" />

    <InfoLabel
      v-if="isLocker"
      :label="translate('parcelLocker')"
      class="mp-mt-1">
      <ParcelLockerIcon />
    </InfoLabel>
  </div>

  <span
    class="mp-ml-auto"
    v-text="distance" />
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {usePickupLocation} from '../../../../composables/usePickupLocation';
import {useLanguage} from '../../../../composables';
import ParcelLockerIcon from '../../../../components/icons/ParcelLockerIcon.vue';
import InfoLabel from '../../../../components/common/InfoLabel/InfoLabel.vue';

const props = defineProps<{locationCode: string}>();
const propRefs = toRefs(props);

const {translate} = useLanguage();

const {address, distance, location, isLocker} = usePickupLocation(propRefs.locationCode);
</script>
