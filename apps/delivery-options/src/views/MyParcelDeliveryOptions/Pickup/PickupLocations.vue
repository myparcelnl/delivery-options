<template>
  <div>
    <div class="mp-flex mp-mb-2">
      <DoButton
        v-for="view in [PICKUP_LOCATIONS_VIEWS_LIST, PICKUP_LOCATIONS_VIEWS_MAP]"
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
import {computed, h, ref} from 'vue';
import {PICKUP_LOCATIONS_VIEWS_LIST, PICKUP_LOCATIONS_VIEWS_MAP, type PickupLocationsView} from '@myparcel-do/shared';
import {useConfigStore} from '../../../stores';
import {useLanguage} from '../../../composables';
import DoButton from '../../../components/common/DoButton/DoButton.vue';
import PickupLocationList from './PickupLocationList/PickupLocationList.vue';

const config = useConfigStore();

const mode = ref<PickupLocationsView>(config.pickupLocationsDefaultView);

const {translate} = useLanguage();

const currentComponent = computed(() =>
  mode.value === PICKUP_LOCATIONS_VIEWS_LIST ? PickupLocationList : () => h('div'),
);
</script>
