<template>
  <Box class="mp-gap-4 mp-grid">
    <h2 v-text="translate('general')" />

    <FieldWrapper :field="{key: CarrierSetting.DropOffDays}">
      <FormDropOffSelector v-model="dropOffDays" />
    </FieldWrapper>

    <FieldWrapper :field="{key: CarrierSetting.DropOffDelay}">
      <FormNumberInput
        v-model="dropOffDelay"
        :min="DROP_OFF_DELAY_MIN"
        :max="DROP_OFF_DELAY_MAX" />
    </FieldWrapper>
    <FieldWrapper :field="{key: CarrierSetting.DeliveryDaysWindow}">
      <FormNumberInput
        v-model="deliveryDaysWindow"
        :min="DELIVERY_DAYS_WINDOW_MIN"
        :max="DELIVERY_DAYS_WINDOW_MAX" />
    </FieldWrapper>
    <FieldWrapper :field="{key: CarrierSetting.AllowPickupLocations}">
      <FormToggleInput v-model="allowPickupLocations" />
    </FieldWrapper>
    <FieldWrapper :field="{key: ConfigSetting.PickupLocationsDefaultView}">
      <FormRadioGroupInput
        v-model="pickupLocationsDefaultView"
        :options="pickupLocationOptions" />
    </FieldWrapper>
    <FieldWrapper :field="{key: ConfigSetting.ShowPriceZeroAsFree}">
      <FormToggleInput v-model="showPriceZeroAsFree" />
    </FieldWrapper>
    <FieldWrapper :field="{key: ConfigSetting.ClosedDays}">
      <FormMultiDateSelect v-model="closedDays" />
    </FieldWrapper>
    <FieldWrapper :field="{key: ConfigSetting.ExcludeParcelLockers}">
      <FormToggleInput v-model="excludeParcelLockers" />
      <!-- exclude parcel lockers -->
    </FieldWrapper>
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {
  CarrierSetting,
  ConfigSetting,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import {useLanguage} from '../composables';
import FormToggleInput from './form/input/FormToggleInput.vue';
import FormRadioGroupInput from './form/input/FormRadioGroupInput.vue';
import FormNumberInput from './form/input/FormNumberInput.vue';
import FormMultiDateSelect from './form/input/FormMultiDateSelect.vue';
import FormDropOffSelector from './form/input/FormDropOffSelector.vue';
import FieldWrapper from './FieldWrapper.vue';
import {Box} from './Box';

const sandboxStore = useSandboxStore();

const dropOffDays = computed({
  get: () => sandboxStore.config.dropOffDays,
  set: (value) => {
    sandboxStore.config.dropOffDays = value;
  },
});

const dropOffDelay = computed({
  get: () => sandboxStore.config.dropOffDelay,
  set: (value) => {
    sandboxStore.config.dropOffDelay = value;
  },
});

const deliveryDaysWindow = computed({
  get: () => sandboxStore.config.deliveryDaysWindow,
  set: (value) => {
    sandboxStore.config.deliveryDaysWindow = value;
  },
});

const allowPickupLocations = computed({
  get: () => sandboxStore.config.allowPickupLocations,
  set: (value) => {
    sandboxStore.config.allowPickupLocations = value;
  },
});

const pickupLocationsDefaultView = computed({
  get: () => sandboxStore.config.pickupLocationsDefaultView,
  set: (value) => {
    sandboxStore.config.pickupLocationsDefaultView = value;
  },
});

const showPriceZeroAsFree = computed({
  get: () => sandboxStore.config.showPriceZeroAsFree,
  set: (value) => {
    sandboxStore.config.showPriceZeroAsFree = value;
  },
});

const closedDays = computed({
  get: () => sandboxStore.config.closedDays,
  set: (value) => {
    sandboxStore.config.closedDays = value;
  },
});

const excludeParcelLockers = computed({
  get: () => sandboxStore.config.excludeParcelLockers,
  set: (value) => {
    sandboxStore.config.excludeParcelLockers = value;
  },
});

const pickupLocationOptions = [
  {label: 'List', value: 'list'},
  {label: 'Map', value: 'map'},
];

const {translate} = useLanguage();
</script>
