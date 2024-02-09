<template>
  <div>
    <PickupLocationInput />

    <div class="mp-flex mp-mb-2">
      <DoButton
        v-for="view in [PickupLocationsView.List, PickupLocationsView.Map]"
        :key="view"
        :active="mode === view"
        @click="mode = view">
        {{ translate(view) }}
      </DoButton>
    </div>

    <KeepAlive>
      <component :is="currentComponent" />
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {PickupLocationsView} from '@myparcel-do/shared';
import {useDeliveryOptionsForm, FIELD_PICKUP_LOCATION} from '@myparcel/delivery-options';
import {useConfigStore} from '../../../stores';
import {useLanguage, useResolvedPickupLocations} from '../../../composables';
import {DoButton} from '../../../components';
import PickupLocationMapWrapper from './PickupLocationMap/PickupLocationMapWrapper.vue';
import PickupLocationListWrapper from './PickupLocationList/PickupLocationListWrapper.vue';
import PickupLocationInput from './PickupLocationInput/PickupLocationInput.vue';

const config = useConfigStore();
const locations = useResolvedPickupLocations();
const form = useDeliveryOptionsForm();

const mode = ref<PickupLocationsView>(config.pickupLocationsDefaultView);

const {translate} = useLanguage();

const currentComponent = computed(() =>
  mode.value === PickupLocationsView.List ? PickupLocationListWrapper : PickupLocationMapWrapper,
);

const selectInitialPickupLocation = (value) => {
  if (!value.length) {
    return;
  }

  const [firstLocation] = locations.value;

  if (form.instance.values[FIELD_PICKUP_LOCATION]) {
    unwatch();
    return;
  }

  form.instance.setValue(FIELD_PICKUP_LOCATION, firstLocation.locationCode);

  unwatch();
};

const unwatch = watch(locations, selectInitialPickupLocation, {immediate: locations.value.length > 0});
</script>
