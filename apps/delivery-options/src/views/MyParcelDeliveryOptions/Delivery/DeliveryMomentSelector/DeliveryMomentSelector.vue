<template>
  <DeliveryMomentSelectorLoader v-show="loading" />

  <DeliveryMomentInput
    v-show="!loading"
    v-model="deliveryMoment"
    :options="options" />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useDeliveryMomentOptions} from '../../../../composables/useDeliveryMomentOptions';
import {useResolvedDeliveryOptions, useSelectedValues} from '../../../../composables';
import DeliveryMomentSelectorLoader from './DeliveryMomentSelectorLoader.vue';
import DeliveryMomentInput from './DeliveryMomentInput.vue';

const deliveryOptions = useResolvedDeliveryOptions();

const loading = computed(() => deliveryOptions.loading.value);

const {deliveryMoment} = useSelectedValues();

const options = useDeliveryMomentOptions();
</script>
