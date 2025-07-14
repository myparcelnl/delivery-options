<template>
  <CarrierBox :carrier="carrierName">
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
          :value="option.value"
          @update:modelValue="onOptionChange(option)" />
      </template>

      <template #default="{option}">
        <PickupLocationListItem
          :carrier-identifier="option.carrier"
          :location-code="option.value" />
      </template>

      <template #content="{option}">
        <KeepAlive>
          <PickupLocationDetails
            v-if="locationCode === option.value && selectedCarrier === option.carrier"
            :carrier-identifier="option.carrier"
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
  type CarrierIdentifier,
  resolveCarrierName,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {getDeliveryTypePrice} from '../../../../utils';
import {useLanguage, useSelectedPickupLocation, useSelectedValues} from '../../../../composables';
import {GroupInput, DoButton, PriceTag} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const props = defineProps<{carrier: CarrierIdentifier; options: SelectOption<T>[]}>();

const carrierName = computed(() => {
  return resolveCarrierName(props.carrier);
});

const propRefs = toRefs(props);

const {locationCode, location} = useSelectedPickupLocation();
const {translate} = useLanguage();
const {carrier: selectedCarrier} = useSelectedValues();

const {
  items: filteredOptions,
  loadMore,
  hasMore,
} = useLoadMore({
  items: propRefs.options,
  start: DEFAULT_MAX_PAGE_ITEMS,
  step: DEFAULT_MAX_PAGE_ITEMS,
  isSelected(option) {
    console.log('Checking if option is selected11111111', locationCode.value, option.value);

    // Skip loading for other carriers
    if (location.value?.carrier !== props.carrier) {
      return true;
    }

    console.log(
      'Checking if option is selected',
      locationCode.value,
      option.value,
      selectedCarrier.value,
      option.carrier,
    );

    return locationCode.value === option.value && selectedCarrier.value === option.carrier;
  },
});

const price = computed(() => {
  return getDeliveryTypePrice(DeliveryTypeName.Pickup, props.carrier);
});

const onOptionChange = (option) => {
  selectedCarrier.value = option.carrier;
};
</script>
