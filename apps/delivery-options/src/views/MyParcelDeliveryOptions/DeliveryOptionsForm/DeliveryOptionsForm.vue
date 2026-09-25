<template>
  <p
    v-if="noOptionsAvailable"
    class="before:mp-absolute before:mp-bg-red-500 before:mp-h-full before:mp-inset-0 before:mp-w-1 mp-bg-opacity-5 mp-bg-red-500 mp-border mp-overflow-hidden mp-px-6 mp-py-4 mp-relative mp-rounded-lg"
    v-text="translate(NO_DELIVERY_OPTIONS_AVAILABLE)" />

  <form v-else>
    <button
      v-if="config.compactView"
      class="focus:mp-outline-none focus:mp-underline hover:mp-underline mp-cursor-pointer mp-gap-1 mp-inline-flex mp-items-center mp-mb-3 mp-text-sm"
      data-testid="compact-back-button"
      type="button"
      @click="onBack">
      <CaretLeftIcon class="mp-flex-shrink-0" />
      {{ translate(COMPACT_BACK_TO_OVERVIEW) }}
    </button>

    <component
      :is="currentComponent"
      v-if="compactFocused" />
    <RadioGroupInput
      v-else
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
            class="mp-sr-only"
            type="radio" />
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
  COMPACT_BACK_TO_OVERVIEW,
  DELIVERY_TITLE,
  NO_DELIVERY_OPTIONS_AVAILABLE,
  PICKUP_TITLE,
  type SelectOption,
  waitForRequestData,
  useCarriersRequest,
} from '@myparcel-dev/do-shared';
import PickupLocations from '../Pickup/PickupLocations.vue';
import HomeDelivery from '../Delivery/HomeDelivery.vue';
import {useConfigStore} from '../../../stores';
import {FIELD_HOME_OR_PICKUP, HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../../../data';
import {
  useActiveCarriers,
  useSharedCapabilities,
  useLanguage,
  useResolvedDeliveryDates,
  useResolvedDeliveryOptions,
  useSelectedValues,
} from '../../../composables';
import {CaretLeftIcon, CaretRightIcon, RadioGroupInput} from '../../../components';

await waitForRequestData(useCarriersRequest);

const carriers = useActiveCarriers();
const {loading: capabilitiesLoading} = useSharedCapabilities();
const {state: config} = useConfigStore();

const {translate} = useLanguage();
const {homeOrPickup, carrier, deliveryDate, clearSelectedValues} = useSelectedValues();

const compactFocused = computed(() => Boolean(config.compactView && carrier.value));

/**
 * Back to compact overview: full reset including deliveryDate AND any memoized
 * delivery-option data, so the next carrier picked starts from a clean state with
 * fresh auto-selections rather than inheriting state from the previous carrier.
 */
function onBack(): void {
  clearSelectedValues();
  deliveryDate.value = undefined;
  useResolvedDeliveryOptions.clear();
  useResolvedDeliveryDates.clear();
}

const options = computed(() => {
  const optionList: SelectOption<string>[] = [];
  const resolvedCarriers = toValue(carriers) ?? [];

  if (resolvedCarriers.some((carrier) => toValue(carrier.hasDelivery))) {
    optionList.push({
      label: DELIVERY_TITLE,
      value: HOME_OR_PICKUP_HOME,
    });
  }

  if (config.allowPickupLocations && resolvedCarriers.some((carrier) => toValue(carrier.hasPickup))) {
    optionList.push({
      label: PICKUP_TITLE,
      value: HOME_OR_PICKUP_PICKUP,
      ecoFriendly: Infinity,
    });
  }

  return optionList;
});

const noOptionsAvailable = computed(() => {
  return !capabilitiesLoading.value && options.value.length === 0;
});

const currentComponent = computed(() => {
  const current = toValue(homeOrPickup);

  return current === HOME_OR_PICKUP_PICKUP ? PickupLocations : HomeDelivery;
});
</script>
