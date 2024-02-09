<template>
  <CarrierBox :carrier="carrier">
    <GroupInput
      :id="carrier"
      :options="filteredOptions">
      <template #input="{option}">
        <RadioInput
          v-model="locationCode"
          :value="option.value" />
      </template>

      <template #default="{option}">
        <PickupLocationListItem :location-code="option.value" />
      </template>

      <template #content="{option}">
        <KeepAlive>
          <PickupLocationDetails
            v-if="locationCode === option.value"
            :location-code="option.value"
            class="mp-mb-2" />
        </KeepAlive>
      </template>
    </GroupInput>

    <DoButton
      v-if="options?.length > shown"
      link
      @click="loadMore">
      {{ translate(SHOW_MORE_LOCATIONS) }}
    </DoButton>
  </CarrierBox>
</template>

<script generic="T" lang="ts" setup>
import {computed, onActivated, ref} from 'vue';
import {
  CarrierBox,
  DEFAULT_MAX_PAGE_ITEMS,
  RadioInput,
  type SelectOption,
  SHOW_MORE_LOCATIONS,
} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';
import {useLanguage, useSelectedPickupLocation} from '../../../../composables';
import {GroupInput, DoButton} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const props = defineProps<{
  carrier: CarrierName;
  options: SelectOption<T>[];
}>();

const shown = ref(DEFAULT_MAX_PAGE_ITEMS);

const {locationCode, location} = useSelectedPickupLocation();

const {translate} = useLanguage();

const loadMore = () => {
  shown.value += DEFAULT_MAX_PAGE_ITEMS;
};

/**
 * Load more pickup locations if the current selected pickup location is not visible.
 */
const loadMoreIfInvisible = (): void => {
  const locationCarrier = location.value?.carrier;

  if (
    !locationCode.value ||
    locationCarrier !== props.carrier ||
    filteredOptions.value.find((option) => option.value === locationCode.value)
  ) {
    return;
  }

  loadMore();
  loadMoreIfInvisible();
};

onActivated(() => {
  loadMoreIfInvisible();
});

const filteredOptions = computed(() => props.options.slice(0, shown.value));
</script>
