<template>
  <div class="mp-flex mp-flex-col mp-gap-2">
    <div class="mp-flex mp-gap-2 mp-items-center">
      <CarrierLogo
        v-if="carrierName"
        :carrier="carrierName" />

      <b v-text="human" />

      <PriceTag
        v-if="price"
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
import {computed, toRefs} from 'vue';
import {CarrierLogo, resolveCarrierName, CarrierSetting} from '@myparcel-do/shared';
import PickupLocationOpeningHours from '../PickupLocationOpeningHours/PickupLocationOpeningHours.vue';
import PickupLocationName from '../PickupLocationList/PickupLocationName.vue';
import {usePickupLocation, useResolvedCarrier} from '../../../../composables';
import {PriceTag} from '../../../../components';

const props = defineProps<{locationCode: string; expanded?: boolean}>();
const propRefs = toRefs(props);

const location = usePickupLocation(propRefs.locationCode);

const carrierName = computed(() => resolveCarrierName(location.value.carrier));

const resolvedCarrier = useResolvedCarrier(location.value.carrier);

const human = computed(() => resolvedCarrier.value?.carrier.value?.human);
const price = computed(() => resolvedCarrier.value?.get(CarrierSetting.PricePickup));
</script>
