<template>
  <div>
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
import {computed, ref} from 'vue';
import {PickupLocationsView} from '@myparcel-do/shared';
import {defineField} from '@myparcel/vue-form-builder';
import {useConfigStore} from '../../../stores';
import {useDeliveryOptionsForm} from '../../../form';
import {FIELD_PICKUP_LOCATION} from '../../../data';
import {useLanguage} from '../../../composables';
import DoButton from '../../../components/common/DoButton/DoButton.vue';
import PickupLocationMap from './PickupLocationMap/PickupLocationMap.vue';
import PickupLocationList from './PickupLocationList/PickupLocationList.vue';

const config = useConfigStore();

const mode = ref<PickupLocationsView>(config.pickupLocationsDefaultView);

const {translate} = useLanguage();

const currentComponent = computed(() =>
  mode.value === PickupLocationsView.List ? PickupLocationList : PickupLocationMap,
);

const form = useDeliveryOptionsForm();

const pickupLocationField = defineField({
  name: FIELD_PICKUP_LOCATION,
  ref: ref(),
  component: 'input',
  attributes: {type: 'hidden'},
});

void form.addElement(pickupLocationField);
</script>
