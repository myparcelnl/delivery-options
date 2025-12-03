<template>
  <DeliveryMomentSelectorLoader v-show="loading" />

  <DeliveryMoment.Component v-show="!loading" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {createField} from '@myparcel-dev/vue-form-builder';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {useDeliveryMomentOptions} from '../../../../composables/useDeliveryMomentOptions';
import {useResolvedDeliveryOptions, useSelectedValues} from '../../../../composables';
import DeliveryMomentSelectorLoader from './DeliveryMomentSelectorLoader.vue';
import DeliveryMomentInput from './DeliveryMomentInput.vue';

const deliveryOptions = useResolvedDeliveryOptions();

const loading = computed(() => deliveryOptions.loading.value);

const {deliveryMoment} = useSelectedValues();

// eslint-disable-next-line @typescript-eslint/naming-convention
const DeliveryMoment = createField({
  name: FIELD_DELIVERY_MOMENT,
  component: DeliveryMomentInput,
  ref: deliveryMoment,
  props: {
    options: useDeliveryMomentOptions(),
  },
});
</script>
