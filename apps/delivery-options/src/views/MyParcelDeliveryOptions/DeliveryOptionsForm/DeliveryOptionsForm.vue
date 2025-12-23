<template>
  <form>
    <RadioGroupInput
      :id="FIELD_HOME_OR_PICKUP"
      v-model="homeOrPickup"
      :options="options">
      <template #input="{option}">
        <span>
          <CaretRightIcon
            :class="{
              'mp-rotate-90': homeOrPickup === option.value,
            }"
            class="mp-cursor-pointer mp-not-sr-only mp-transition-transform" />

          <input
            v-model="homeOrPickup"
            :value="option.value"
            type="radio"
            class="mp-sr-only" />
        </span>
      </template>

      <template #default="{option}">
        <b v-text="translate(option.label)" />
      </template>

      <template #content="{option}">
        <KeepAlive>
          <component
            :is="currentComponent"
            v-if="homeOrPickup === option.value"
            class="mp-pl-4 mp-py-2" />
        </KeepAlive>
      </template>
    </RadioGroupInput>
  </form>
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {
  DELIVERY_TITLE,
  PICKUP_TITLE,
  type SelectOption,
  waitForRequestData,
  useCarriersRequest,
} from '@myparcel-dev/do-shared';
import PickupLocations from '../Pickup/PickupLocations.vue';
import HomeDelivery from '../Delivery/HomeDelivery.vue';
import {useConfigStore} from '../../../stores';
import {
  FIELD_HOME_OR_PICKUP,
  HOME_OR_PICKUP_HOME,
  HOME_OR_PICKUP_PICKUP,
} from '../../../data';
import {
  useActiveCarriers,
  useLanguage,
  useSelectedValues,
} from '../../../composables';
import {CaretRightIcon, RadioGroupInput} from '../../../components';
import {getHasPickupForPackage} from '../../../utils/getHasPickupForPackage';

await waitForRequestData(useCarriersRequest);

const carriers = useActiveCarriers();
const {state: config} = useConfigStore();

const {translate} = useLanguage();
const {homeOrPickup} = useSelectedValues();

const options = computed(() => {
  const optionList: SelectOption<string>[] = [];
  const resolvedCarriers = toValue(carriers) ?? [];

  if (resolvedCarriers.some((carrier) => toValue(carrier.hasAnyDelivery))) {
    optionList.push({
      label: DELIVERY_TITLE,
      value: HOME_OR_PICKUP_HOME,
    });
  }

  if (
    resolvedCarriers.some((carrier) =>
      getHasPickupForPackage(carrier, config.packageType),
    )
  ) {
    optionList.push({
      label: PICKUP_TITLE,
      value: HOME_OR_PICKUP_PICKUP,
      ecoFriendly: Infinity,
    });
  }

  return optionList;
});

const currentComponent = computed(() => {
  const current = toValue(homeOrPickup);

  return current === HOME_OR_PICKUP_PICKUP ? PickupLocations : HomeDelivery;
});
</script>
