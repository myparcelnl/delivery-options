<template>
  <PickupLocation.Component>
    <template #default="{option}">
      <PickupLocationListItem :location-code="option.value" />
    </template>

    <template #content="{option}">
      <PickupLocationDetails :location-code="option.value" />
    </template>
  </PickupLocation.Component>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {get} from '@vueuse/core';
import {type SelectOption} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {FIELD_PICKUP_LOCATION} from '../../../../constants';
import {useResolvedPickupLocations} from '../../../../composables';
import {RadioGroupInput} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const pickupLocations = useResolvedPickupLocations();

const value = ref();

const options = computed<SelectOption[]>(() => {
  return (get(pickupLocations.value) ?? []).map((option) => ({
    label: option.location.location_name,
    carrier: option.carrier,
    value: option.location.location_code,
  }));
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
</script>
