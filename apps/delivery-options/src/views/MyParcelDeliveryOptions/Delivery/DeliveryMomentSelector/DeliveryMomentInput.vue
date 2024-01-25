<template>
  <div class="mp-gap-4 mp-grid mp-grid-flow-row">
    <DeliveryMomentCarrierGroup
      v-for="[carrier, group] in groupedOptions"
      :key="carrier"
      v-model="model"
      :carrier="carrier"
      :options="group" />
  </div>
</template>

<script generic="T" lang="ts" setup>
import {computed, toRefs, watch} from 'vue';
import {useVModel} from '@vueuse/core';
import {type RadioGroupEmits, type RadioGroupProps, type SelectOption, type WithElement} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';
import {useSelectedDeliveryDate} from '../../../../composables';
import DeliveryMomentCarrierGroup from './DeliveryMomentCarrierGroup.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const model = useVModel(props, undefined, emit);

const propRefs = toRefs(props);

const date = useSelectedDeliveryDate();

const options = computed<SelectOption<T>[]>(() => {
  const {options} = propRefs.element.value.props;

  return options;
});

const groupedOptions = computed<[CarrierName, SelectOption<T>[]][]>(() => {
  const groupedOptions = options.value.reduce((acc, option: SelectOption<T>) => {
    const group = option.carrier;

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(option);
    return acc;
  }, {} as Record<CarrierName, SelectOption<T>[]>);

  return Object.entries(groupedOptions) as [CarrierName, SelectOption<T>[]][];
});

watch(
  date,
  () => {
    model.value = options.value[0].value;
  },
  {immediate: options.value.length > 0},
);
</script>
