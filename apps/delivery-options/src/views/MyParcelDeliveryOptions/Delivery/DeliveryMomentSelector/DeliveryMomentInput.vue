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

<script lang="ts" setup>
import {toRefs, watch, onMounted, toValue} from 'vue';
import {useVModel} from '@vueuse/core';
import {
  CarrierBox,
  type RadioGroupEmits,
  type RadioGroupProps,
  RadioInput,
  type WithElement,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {parseJson} from '../../../../utils';
import {type SelectedDeliveryMoment} from '../../../../types';
import {FIELD_DELIVERY_MOMENT} from '../../../../data';
import {useOptionsGroupedByCarrier, useLanguage, useSelectedValues} from '../../../../composables';
import {GroupInput} from '../../../../components';

const props = defineProps<WithElement<RadioGroupProps>>();
const emit = defineEmits<RadioGroupEmits>();
const propRefs = toRefs(props);

const model = useVModel(props, undefined, emit);

const {translate} = useLanguage();
// @ts-expect-error todo: fix types
const {options, grouped} = useOptionsGroupedByCarrier<string>(propRefs.element);
const {deliveryMoment, deliveryDate} = useSelectedValues();

/**
 * Automatically select the first standard delivery moment whenever the selected date changes.
 * This ensures that a default value is set when the component is first rendered.
 * When options change (e.g., due to address change), preserve the previously selected carrier if available.
 */
watch(
  [options, deliveryDate],
  () => {
    if (!options.value.length > 0) {
      return;
    }

    const resolvedOptions = toValue(options);
    // Try to preserve the previously selected carrier
    let selectedOption;
    // Get the currently selected carrier (if any)
    const currentSelection = deliveryMoment.value ? parseJson<SelectedDeliveryMoment>(deliveryMoment.value) : null;
    const currentCarrier = currentSelection?.carrier;

    // If we have a previously selected carrier, try to find a standard delivery option for that carrier
    if (currentCarrier) {
      selectedOption = resolvedOptions.find((option) => {
        const parsed = parseJson<SelectedDeliveryMoment>(option.value);
        return parsed.carrier === currentCarrier && parsed.deliveryType === DeliveryTypeName.Standard;
      });
    }

    // If the previous carrier is not available, fall back to the first standard delivery option
    if (!selectedOption) {
      selectedOption = resolvedOptions.find((option) => {
        return parseJson<SelectedDeliveryMoment>(option.value).deliveryType === DeliveryTypeName.Standard;
      });
    }

    // Final fallback: use the first option available
    model.value = selectedOption?.value ?? resolvedOptions[0]?.value;
  },
  {immediate: options.value.length > 0, deep: true},
);
</script>
