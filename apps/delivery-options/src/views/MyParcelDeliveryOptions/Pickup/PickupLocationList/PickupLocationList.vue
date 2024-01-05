<template>
  <PickupLocation.Component>
    <template #default="{option}">
      <PickupLocationListItem :pickup-location="option.value" />
    </template>

    <template #content="{option}">
      <PickupLocationDetails
        v-if="value === option.value"
        :pickup-location="option.value"
        class="mp-mb-2" />
    </template>
  </PickupLocation.Component>

  <DoButton
    v-if="pickupLocations?.length > shown"
    class="mp-mt-4"
    type="button"
    @click="loadMore">
    {{ translate(LOAD_MORE) }}
  </DoButton>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {get} from '@vueuse/core';
import {DEFAULT_MAX_PAGE_ITEMS, LOAD_MORE, type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_PICKUP_LOCATION} from '../../../../data';
import {useLanguage, useResolvedPickupLocations} from '../../../../composables';
import DoButton from '../../../../components/common/DoButton/DoButton.vue';
import {RadioGroupInput} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const pickupLocations = useResolvedPickupLocations();

const value = ref();

const shown = ref(DEFAULT_MAX_PAGE_ITEMS);

const {translate} = useLanguage();

const options = computed<SelectOption[]>(() => {
  return (get(pickupLocations.value) ?? [])
    .map((option) => ({
      label: option.location.location_name,
      carrier: option.carrier,
      value: JSON.stringify(option),
    }))
    .slice(0, shown.value);
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const PickupLocation = createField({
  name: FIELD_PICKUP_LOCATION,
  ref: value,
  component: RadioGroupInput,
  props: {
    loading: computed(() => !options.value.length),
    options,
  },
});

const loadMore = () => {
  shown.value += DEFAULT_MAX_PAGE_ITEMS;
};
</script>
