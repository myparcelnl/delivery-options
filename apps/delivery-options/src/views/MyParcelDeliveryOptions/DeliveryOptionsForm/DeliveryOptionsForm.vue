<template>
  <Form.Component>
    <HomeOrPickup.Component>
      <template #content="{option}">
        <KeepAlive>
          <component
            :is="currentComponent"
            v-if="homeOrPickup === option.value"
            class="mp-pl-4 mp-pt-4" />
        </KeepAlive>
      </template>
    </HomeOrPickup.Component>
  </Form.Component>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {get} from '@vueuse/core';
import {DELIVERY_TITLE, PICKUP_TITLE, type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import PickupLocations from '../Pickup/PickupLocations.vue';
import HomeDelivery from '../Delivery/HomeDelivery.vue';
import {useDeliveryOptionsForm} from '../../../form';
import {FIELD_HOME_OR_PICKUP, HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../../../data';
import {useActiveCarriers, useLanguage} from '../../../composables';
import {RadioGroupInput} from '../../../components';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Form = useDeliveryOptionsForm();

const {translate} = useLanguage();

const carriers = useActiveCarriers();

const homeOrPickup = ref();

// eslint-disable-next-line @typescript-eslint/naming-convention
const HomeOrPickup = createField({
  name: FIELD_HOME_OR_PICKUP,
  component: RadioGroupInput,
  ref: homeOrPickup,
  props: {
    options: computed(() => {
      const options: SelectOption[] = [];
      const resolvedCarriers = get(carriers) ?? [];

      if (resolvedCarriers.some((carrier) => get(carrier.hasDelivery))) {
        options.push({
          label: translate(DELIVERY_TITLE),
          value: HOME_OR_PICKUP_HOME,
        });
      }

      if (resolvedCarriers.some((carrier) => get(carrier.hasPickup))) {
        options.push({
          label: translate(PICKUP_TITLE),
          value: HOME_OR_PICKUP_PICKUP,
          ecoFriendly: Infinity,
        });
      }

      return options;
    }),
  },
});

const currentComponent = computed(() => {
  const current = get(HomeOrPickup.ref);

  return current === HOME_OR_PICKUP_PICKUP ? PickupLocations : HomeDelivery;
});
</script>
