<template>
  <PickupLocation.Component>
    <template #default="{option}">
      <PickupLocationListItem :location-code="option.value" />
    </template>

    <template #content="{option}">
      <KeepAlive>
        <PickupLocationDetails
          v-if="model === option.value"
          :location-code="option.value"
          class="mp-mb-2" />
      </KeepAlive>
    </template>
  </PickupLocation.Component>

  <DoButton
    v-if="pickupLocations?.length > shown"
    class="mp-mt-4"
    type="button"
    @click="loadMore">
    {{ translate(SHOW_MORE_LOCATIONS) }}
  </DoButton>
</template>

<script lang="ts" setup>
import {computed, onActivated, ref} from 'vue';
import {get} from '@vueuse/core';
import {DEFAULT_MAX_PAGE_ITEMS, PickupLocationsView, type SelectOption, SHOW_MORE_LOCATIONS} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useLanguage, useResolvedPickupLocations, useSelectedPickupLocation} from '../../../../composables';
import DoButton from '../../../../components/common/DoButton/DoButton.vue';
import {RadioGroupInput} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const pickupLocations = useResolvedPickupLocations();

const shown = ref(DEFAULT_MAX_PAGE_ITEMS);

const {translate} = useLanguage();

const options = computed<SelectOption[]>(() => {
  return (get(pickupLocations.value) ?? [])
    .map((option) => ({
      label: option.location.location_name,
      carrier: option.carrier,
      value: option.location.location_code,
    }))
    .slice(0, shown.value);
});

const {model} = useSelectedPickupLocation();

// eslint-disable-next-line @typescript-eslint/naming-convention
const PickupLocation = createField({
  name: `${PickupLocationsView.List}_${FIELD_PICKUP_LOCATION}`,
  ref: model,
  component: RadioGroupInput,
  props: {
    loading: computed(() => !options.value.length),
    options,
  },
});

const loadMore = () => {
  shown.value += DEFAULT_MAX_PAGE_ITEMS;
};

/**
 * Load more pickup locations if the current selected pickup location is not visible.
 */
const loadMoreIfInvisible = (): void => {
  if (!model.value || !options.value.length || options.value.some((option) => option.value === model.value)) {
    return;
  }

  loadMore();
  loadMoreIfInvisible();
};

onActivated(() => {
  loadMoreIfInvisible();
});
</script>
