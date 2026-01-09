<template>
  <Box class="mp-gap-4 mp-grid">
    <h2 v-text="translate('general')" />

    <FieldWrapper :field="{ key: CarrierSetting.DropOffDays }">
      <FormDropOffSelector v-model="dropOffDays" />
    </FieldWrapper>

    <FieldWrapper :field="{ key: CarrierSetting.DropOffDelay }">
      <FormNumberInput v-model="dropOffDelay" :min="DROP_OFF_DELAY_MIN" :max="DROP_OFF_DELAY_MAX"/>
    </FieldWrapper>
    <FieldWrapper :field="{ key: CarrierSetting.DeliveryDaysWindow }">
      <FormNumberInput v-model="deliveryDaysWindow" :min="DELIVERY_DAYS_WINDOW_MIN" :max="DELIVERY_DAYS_WINDOW_MAX"/>
    </FieldWrapper>
    <FieldWrapper :field="{ key: CarrierSetting.AllowPickupLocations }">
      <FormToggleInput v-model="allowPickupLocations" />
    </FieldWrapper>
    <FieldWrapper :field="{ key: ConfigSetting.PickupLocationsDefaultView }">
      <FormRadioGroupInput v-model="pickupLocationsDefaultView" :options="pickupLocationOptions"/>
    </FieldWrapper>
    <FieldWrapper :field="{ key: ConfigSetting.ShowPriceZeroAsFree }">
      <FormToggleInput v-model="showPriceZeroAsFree" />
    </FieldWrapper>
    <FieldWrapper :field="{ key: ConfigSetting.ClosedDays }">
      <FormMultiDateSelect v-model="closedDays" />
    </FieldWrapper>
    <FieldWrapper :field="{ key: ConfigSetting.ExcludeParcelLockers }">
      <FormToggleInput v-model="excludeParcelLockers" /> <!-- exclude parcel lockers -->
    </FieldWrapper>
  </Box>
</template>

<script lang="ts" setup>
import {
  CarrierSetting,
  ConfigSetting,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN
} from '@myparcel-dev/do-shared';

import {useLanguage} from '../composables';
import { useSandboxStore } from '../stores';

import {Box} from './Box';
import FormDropOffSelector from './form/input/FormDropOffSelector.vue';
import FormMultiDateSelect from './form/input/FormMultiDateSelect.vue';
import FormNumberInput from './form/input/FormNumberInput.vue';
import FormRadioGroupInput from './form/input/FormRadioGroupInput.vue';
import FormToggleInput from './form/input/FormToggleInput.vue';
import FieldWrapper from './FieldWrapper.vue';
import { ref } from 'vue';

const sandboxStore = useSandboxStore();
const dropOffDays = sandboxStore.config.dropOffDays;
const dropOffDelay = sandboxStore.config.dropOffDelay;
const deliveryDaysWindow = sandboxStore.config.deliveryDaysWindow;
const allowPickupLocations = sandboxStore.config.allowPickupLocations;
const pickupLocationsDefaultView = sandboxStore.config.pickupLocationsDefaultView;
const showPriceZeroAsFree = sandboxStore.config.showPriceZeroAsFree;
const closedDays = sandboxStore.config.closedDays;
const excludeParcelLockers = sandboxStore.config.excludeParcelLockers;

const pickupLocationOptions = [
  { label: 'List', value: 'list' },
  { label: 'Map', value: 'map' },
];

const {translate} = useLanguage();
</script>
