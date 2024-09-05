<template>
  <CarrierBox :carrier="carrier">
    <template #heading>
      <PriceTag
        :price="price"
        class="mp-ml-auto" />
    </template>

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
      v-if="hasMore"
      link
      @click="loadMore">
      {{ translate(SHOW_MORE_LOCATIONS) }}
    </DoButton>
  </CarrierBox>
</template>

<script generic="T" lang="ts" setup>
import {computed, toRefs} from 'vue';
import {
  CarrierBox,
  DEFAULT_MAX_PAGE_ITEMS,
  RadioInput,
  type SelectOption,
  SHOW_MORE_LOCATIONS,
  useLoadMore,
} from '@myparcel-do/shared';
import {type CarrierName, DeliveryTypeName} from '@myparcel/constants';
import {getDeliveryTypePrice} from '../../../../utils';
import {useLanguage, useSelectedPickupLocation} from '../../../../composables';
import {GroupInput, DoButton, PriceTag} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const props = defineProps<{carrier: CarrierName; options: SelectOption<T>[]}>();
const propRefs = toRefs(props);

const {locationCode, location} = useSelectedPickupLocation();
const {translate} = useLanguage();

const {
  items: filteredOptions,
  loadMore,
  hasMore,
} = useLoadMore({
  items: propRefs.options,
  start: DEFAULT_MAX_PAGE_ITEMS,
  step: DEFAULT_MAX_PAGE_ITEMS,
  isSelected(option) {
    // Skip loading for other carriers
    if (location.value?.carrier !== props.carrier) {
      return true;
    }

    return locationCode.value === option.value;
  },
});
const price = computed(() => {
  return getDeliveryTypePrice(DeliveryTypeName.Pickup, props.options[0]?.carrier);
});
</script>
