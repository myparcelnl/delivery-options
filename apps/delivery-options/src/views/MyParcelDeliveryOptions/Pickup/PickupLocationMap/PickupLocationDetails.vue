<template>
  <div
    v-if="pickupLocation"
    class="mp-flex mp-flex-col mp-gap-2">
    <div class="mp-flex mp-gap-2 mp-items-center">
      <CarrierLogo
        v-if="pickupLocation.carrier"
        :carrier="pickupLocation.carrier" />

      <b v-text="carrier?.human" />

      <PriceTag
        v-if="price !== undefined"
        :price="price"
        class="mp-ml-auto" />
    </div>

    <div>
      <PickupLocationName :location-code="locationCode" />
    </div>

    <PickupLocationOpeningHours
      :expanded="expanded"
      :location-code="locationCode" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs, ref, computed} from 'vue';
import {watchImmediate} from '@vueuse/core';
import {CarrierLogo, CarrierSetting} from '@myparcel-do/shared';
import PickupLocationOpeningHours from '../PickupLocationOpeningHours/PickupLocationOpeningHours.vue';
import PickupLocationName from '../PickupLocationList/PickupLocationName.vue';
import {usePickupLocation} from '../../../../composables';
import {PriceTag} from '../../../../components';

const props = defineProps<{locationCode: string; expanded?: boolean}>();
const propRefs = toRefs(props);

const {pickupLocation, resolvedCarrier} = usePickupLocation(propRefs.locationCode);

const price = ref();

const carrier = computed(() => resolvedCarrier.value?.carrier.value);

watchImmediate(propRefs.locationCode, () => {
  if (!resolvedCarrier.value) {
    return;
  }

  price.value = resolvedCarrier.value.get(CarrierSetting.PricePickup);
});
</script>
