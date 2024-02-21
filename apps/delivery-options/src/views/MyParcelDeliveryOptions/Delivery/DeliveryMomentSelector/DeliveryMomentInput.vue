<template>
  <div class="mp-gap-4 mp-grid">
    <CarrierBox
      v-for="[carrier, group] in grouped"
      :key="carrier"
      :carrier="carrier">
      <GroupInput
        :id="carrier"
        :options="group">
        <template #input="{option}">
          <RadioInput
            v-model="model"
            :name="FIELD_DELIVERY_MOMENT"
            :value="option.value"
            type="radio" />
        </template>

        <template #default="{option}">
          <span v-text="translate(option.label)" />
        </template>
      </GroupInput>
    </CarrierBox>
  </div>
</template>

<script generic="T extends string | null" lang="ts" setup>
import {toRefs, watch, toValue} from 'vue';
import {useVModel} from '@vueuse/core';
import {
  CarrierBox,
  type RadioGroupEmits,
  type RadioGroupProps,
  RadioInput,
  type WithElement,
} from '@myparcel-do/shared';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {useOptionsGroupedByCarrier, useSelectedDeliveryDate, useLanguage} from '../../../../composables';
import {GroupInput} from '../../../../components';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();
const propRefs = toRefs(props);

const model = useVModel(props, undefined, emit);

const date = useSelectedDeliveryDate();
const {translate} = useLanguage();

const {options, grouped} = useOptionsGroupedByCarrier(propRefs.element);

watch(
  [options, date],
  () => {
    if (!options.value.length > 0) {
      return;
    }

    const [first] = toValue(options);
    model.value = first.value;
  },
  {immediate: options.value.length > 0},
);
</script>
