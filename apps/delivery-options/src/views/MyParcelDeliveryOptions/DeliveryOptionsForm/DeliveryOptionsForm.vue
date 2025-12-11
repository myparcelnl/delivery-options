<template>
  <Form.Component v-if="ready">
    <HomeOrPickup.Component>
      <template #input="{option}">
        <span>
          <CaretRightIcon
            :class="{
              'mp-rotate-90': homeOrPickup === option.value,
            }"
            class="mp-cursor-pointer mp-not-sr-only mp-transition-transform" />

          <RadioInput
            v-model="homeOrPickup"
            :value="option.value"
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
    </HomeOrPickup.Component>
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, ref, toValue} from 'vue';
import {
  DELIVERY_TITLE,
  PICKUP_TITLE,
  RadioInput,
  type SelectOption,
  waitForRequestData,
  useCarriersRequest,
} from '@myparcel-dev/shared';
import {createField} from '@myparcel-dev/vue-form-builder';
import PickupLocations from '../Pickup/PickupLocations.vue';
import HomeDelivery from '../Delivery/HomeDelivery.vue';
import {useConfigStore} from '../../../stores';
import {useDeliveryOptionsForm} from '../../../form';
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

const ready = ref(false);

waitForRequestData(useCarriersRequest).then(() => {
  ready.value = true;
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = useDeliveryOptionsForm();
const carriers = useActiveCarriers();
const {state: config} = useConfigStore();

const {translate} = useLanguage();
const {homeOrPickup} = useSelectedValues();

// eslint-disable-next-line @typescript-eslint/naming-convention
const HomeOrPickup = createField({
  name: FIELD_HOME_OR_PICKUP,
  component: RadioGroupInput,
  ref: homeOrPickup,
  props: {
    options: computed(() => {
      const options: SelectOption[] = [];
      const resolvedCarriers = toValue(carriers) ?? [];

      if (resolvedCarriers.some((carrier) => toValue(carrier.hasAnyDelivery))) {
        options.push({
          label: DELIVERY_TITLE,
          value: HOME_OR_PICKUP_HOME,
        });
      }

      if (
        resolvedCarriers.some((carrier) =>
          getHasPickupForPackage(carrier, config.packageType),
        )
      ) {
        options.push({
          label: PICKUP_TITLE,
          value: HOME_OR_PICKUP_PICKUP,
          ecoFriendly: Infinity,
        });
      }

      return options;
    }),
  },
});

const currentComponent = computed(() => {
  const current = toValue(HomeOrPickup.ref);

  return current === HOME_OR_PICKUP_PICKUP ? PickupLocations : HomeDelivery;
});
</script>
