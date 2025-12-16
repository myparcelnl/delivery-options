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
          v-model="selectedCompositeKey"
          :value="compositeKey(option.value, option.carrier)" />
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

<script lang="ts" setup>
import {computed, toRefs, ref, watch} from 'vue';
import {
  CarrierBox,
  DEFAULT_MAX_PAGE_ITEMS,
  type SelectOption,
  SHOW_MORE_LOCATIONS,
  useLoadMore,
  type CarrierIdentifier,
  resolveCarrierName,
  RadioInput,
} from '@myparcel-dev/do-shared';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {getDeliveryTypePrice} from '../../../../utils';
import {useLanguage, useSelectedPickupLocation, useSelectedValues} from '../../../../composables';
import {GroupInput, DoButton, PriceTag} from '../../../../components';
import PickupLocationListItem from './PickupLocationListItem.vue';
import PickupLocationDetails from './PickupLocationDetails.vue';

const props = defineProps<{carrier: CarrierIdentifier; options: SelectOption[]}>();

const carrierName = computed(() => {
  return resolveCarrierName(props.carrier);
});

const propRefs = toRefs(props);

const {locationCode, location} = useSelectedPickupLocation();
const {translate} = useLanguage();
const {carrier: selectedCarrier} = useSelectedValues();

// Create a composite key for the location code and carrier to uniquely identify the selected option
const compositeKey = (locationCode: string, carrier: string): string => `${locationCode}|${carrier}`;
const selectedCompositeKey = ref(compositeKey(locationCode.value ?? '', selectedCarrier.value ?? ''));

// Watch for changes in locationCode and selectedCarrier to update the selectedCompositeKey
watch([locationCode, selectedCarrier], ([newCode, newCarrier]) => {
  selectedCompositeKey.value = compositeKey(newCode ?? '', newCarrier ?? '');
});

// Watch for changes in selectedCompositeKey to update locationCode and selectedCarrier
watch(selectedCompositeKey, (newCompositeKey) => {
  const [newCode, newCarrier] = newCompositeKey.split('|');
  locationCode.value = newCode;
  selectedCarrier.value = newCarrier as CarrierIdentifier;
});

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

    return locationCode.value === option.value && selectedCarrier.value === option.carrier;
  },
});

const price = computed(() => {
  return getDeliveryTypePrice(DeliveryTypeName.Pickup, props.carrier);
});
</script>
